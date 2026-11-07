/**
 * Web Push: RFC 8291 (aes128gcm) + VAPID ES256.
 * O par de chaves vem de bindings; nada é gravado no repositório.
 * Incerteza documentada no runbook: timeout depois do aceite do serviço pode duplicar.
 */
import { TTL_SEG } from './constantes.js';
import { ascii, b64urlDecode, b64urlEncode, concat } from './bytes.js';

const RS = 4096;

async function hkdf(ikm, salt, info, bits) {
  const key = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  const out = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt, info },
    key,
    bits,
  );
  return new Uint8Array(out);
}

function pad32(bytes) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  if (u8.length === 32) return u8;
  if (u8.length < 1 || u8.length > 32) throw new Error('cifra');
  const out = new Uint8Array(32);
  out.set(u8, 32 - u8.length);
  return out;
}

function jwkEcdh(privateRaw, publicRaw) {
  const privada = pad32(privateRaw);
  if (publicRaw.length !== 65 || publicRaw[0] !== 0x04) throw new Error('cifra');
  return {
    kty: 'EC',
    crv: 'P-256',
    d: b64urlEncode(privada),
    x: b64urlEncode(publicRaw.slice(1, 33)),
    y: b64urlEncode(publicRaw.slice(33, 65)),
  };
}

async function segredoEcdh(privateRaw, publicLocal, publicRemota) {
  const priv = await crypto.subtle.importKey(
    'jwk',
    jwkEcdh(privateRaw, publicLocal),
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    ['deriveBits'],
  );
  const pub = await crypto.subtle.importKey(
    'raw',
    publicRemota,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    [],
  );
  const bits = await crypto.subtle.deriveBits({ name: 'ECDH', public: pub }, priv, 256);
  return new Uint8Array(bits);
}

async function parEfemerico(fixo) {
  if (fixo) {
    return { privateRaw: fixo.localPrivateRaw, publicRaw: fixo.localPublicRaw, salt: fixo.salt };
  }
  const par = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const publicRaw = new Uint8Array(await crypto.subtle.exportKey('raw', par.publicKey));
  const jwk = await crypto.subtle.exportKey('jwk', par.privateKey);
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  return { privateRaw: pad32(b64urlDecode(jwk.d)), publicRaw, salt };
}

export async function cifrarAes128gcm(payload, userPublic, authSecret, fixo) {
  const { privateRaw, publicRaw, salt } = await parEfemerico(fixo);
  const ecdh = await segredoEcdh(privateRaw, publicRaw, userPublic);
  const ikmInfo = concat(ascii('WebPush: info\0'), userPublic, publicRaw);
  const ikm = await hkdf(ecdh, authSecret, ikmInfo, 256);
  const cek = await hkdf(ikm, salt, ascii('Content-Encoding: aes128gcm\0'), 128);
  const nonce = await hkdf(ikm, salt, ascii('Content-Encoding: nonce\0'), 96);
  const aes = await crypto.subtle.importKey('raw', cek, { name: 'AES-GCM' }, false, ['encrypt']);
  const claro = concat(payload, new Uint8Array([2]));
  const cifrado = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce, tagLength: 128 }, aes, claro),
  );
  const rs = new Uint8Array(4);
  new DataView(rs.buffer).setUint32(0, RS, false);
  return concat(salt, rs, new Uint8Array([publicRaw.length]), publicRaw, cifrado);
}

export async function assinarJwtVapid({ aud, sub, exp, publicRaw, privateRaw }) {
  const header = b64urlEncode(ascii(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const corpo = b64urlEncode(ascii(JSON.stringify({ aud, exp, sub })));
  const entrada = `${header}.${corpo}`;
  const chave = await crypto.subtle.importKey(
    'jwk',
    { ...jwkEcdh(privateRaw, publicRaw), key_ops: ['sign'] },
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  );
  const assinatura = new Uint8Array(
    await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, chave, ascii(entrada)),
  );
  if (assinatura.length !== 64) throw new Error('vapid');
  return `${entrada}.${b64urlEncode(assinatura)}`;
}

export async function montarPedidoPush({ endpoint, p256dh, auth, payload, vapid, agora }) {
  let url;
  try {
    url = new URL(endpoint);
  } catch {
    throw new Error('endpoint');
  }
  if (url.protocol !== 'https:') throw new Error('endpoint');
  const corpo = JSON.stringify({
    titulo: payload.titulo,
    texto: payload.texto,
    url: payload.url,
    tag: payload.tag,
  });
  if (ascii(corpo).length > 2800) throw new Error('payload');
  const body = await cifrarAes128gcm(ascii(corpo), b64urlDecode(p256dh), b64urlDecode(auth));
  const exp = Math.floor(agora.getTime() / 1000) + 12 * 3600;
  const jwt = await assinarJwtVapid({
    aud: url.origin,
    sub: vapid.subject,
    exp,
    publicRaw: b64urlDecode(vapid.publicKey),
    privateRaw: b64urlDecode(vapid.privateKey),
  });
  return {
    url: endpoint,
    headers: {
      Authorization: `vapid t=${jwt}, k=${vapid.publicKey}`,
      'Content-Encoding': 'aes128gcm',
      'Content-Type': 'application/octet-stream',
      TTL: String(TTL_SEG),
      Urgency: 'normal',
    },
    body,
  };
}
