import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import test from 'node:test';
import ece from 'http_ece';
import { b64urlDecode, b64urlEncode } from '../src/bytes.js';
import { assinarJwtVapid, cifrarAes128gcm, medirCifra, montarPedidoPush } from '../src/crypto-push.js';

function parEcdh() {
  const ecdh = crypto.createECDH('prime256v1');
  ecdh.generateKeys();
  return ecdh;
}

test('medição cifra sem rede', async () => {
  const r = await medirCifra();
  assert.equal(typeof r.cifraMs, 'number');
  assert.equal(r.cifraMs >= 0, true);
});

test('aes128gcm coincide com http_ece e o destinatário recupera o JSON', async () => {
  const remetente = parEcdh();
  const destinatario = parEcdh();
  const auth = crypto.randomBytes(16);
  const salt = crypto.randomBytes(16);
  const payload = Buffer.from(
    JSON.stringify({
      titulo: 'Nova Notícia',
      texto: 'Título',
      url: '/briefings/2026-11-07-alfa',
      tag: '2026-11-07-alfa',
    }),
  );
  const deles = ece.encrypt(payload, {
    version: 'aes128gcm',
    dh: destinatario.getPublicKey(),
    privateKey: remetente,
    salt: salt.toString('base64url'),
    authSecret: auth.toString('base64url'),
  });
  const nosso = Buffer.from(
    await cifrarAes128gcm(payload, destinatario.getPublicKey(), auth, {
      salt,
      localPrivateRaw: remetente.getPrivateKey(),
      localPublicRaw: remetente.getPublicKey(),
    }),
  );
  assert.equal(nosso.equals(Buffer.from(deles)), true);
  const claro = ece.decrypt(nosso, {
    version: 'aes128gcm',
    privateKey: destinatario,
    authSecret: auth.toString('base64url'),
  });
  assert.equal(claro.toString(), payload.toString());
});

test('VAPID ES256 usa aud só com a origem e o pedido não leva Crypto-Key', async () => {
  const par = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
  const publica = new Uint8Array(await crypto.subtle.exportKey('raw', par.publicKey));
  const jwk = await crypto.subtle.exportKey('jwk', par.privateKey);
  const privada = b64urlDecode(jwk.d);
  const agora = new Date('2026-11-07T15:00:00.000Z');
  const endpoint = 'https://fcm.googleapis.com/fcm/send/identificador-que-nao-pode-ir-no-jwt';
  const pedido = await montarPedidoPush({
    endpoint,
    p256dh: b64urlEncode(parEcdh().getPublicKey()),
    auth: b64urlEncode(crypto.randomBytes(16)),
    payload: {
      titulo: 'Nova Vulnerabilidade',
      texto: 'Edge',
      url: '/briefings/2026-11-07-alfa',
      tag: '2026-11-07-alfa',
    },
    vapid: {
      subject: 'https://dsb.duarte.top/sobre',
      publicKey: b64urlEncode(publica),
      privateKey: b64urlEncode(privada),
    },
    agora,
  });
  assert.equal(pedido.headers['Content-Encoding'], 'aes128gcm');
  assert.equal(pedido.headers.TTL, '21600');
  assert.equal(pedido.headers.Urgency, 'normal');
  assert.equal(pedido.headers['Crypto-Key'], undefined);
  assert.match(pedido.headers.Authorization, /^vapid t=[^ ]+, k=/);
  const jwt = pedido.headers.Authorization.slice('vapid t='.length).split(', k=')[0];
  const [h, p, s] = jwt.split('.');
  const header = JSON.parse(new TextDecoder().decode(b64urlDecode(h)));
  const claims = JSON.parse(new TextDecoder().decode(b64urlDecode(p)));
  assert.equal(header.alg, 'ES256');
  assert.equal(claims.aud, 'https://fcm.googleapis.com');
  assert.equal(claims.sub, 'https://dsb.duarte.top/sobre');
  assert.equal(claims.exp, Math.floor(agora.getTime() / 1000) + 12 * 3600);
  assert.equal(jwt.includes('identificador-que-nao-pode'), false);
  const ok = await crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    par.publicKey,
    b64urlDecode(s),
    new TextEncoder().encode(`${h}.${p}`),
  );
  assert.equal(ok, true);
  const deNovo = await assinarJwtVapid({
    aud: claims.aud,
    sub: claims.sub,
    exp: claims.exp,
    publicRaw: publica,
    privateRaw: privada,
  });
  assert.equal(deNovo.split('.').length, 3);
});
