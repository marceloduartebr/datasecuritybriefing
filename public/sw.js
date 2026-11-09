// VERSAO é trocada no build (astro.config.mjs → astro:build:done) pelo commit do deploy.
// Assim cada deploy muda os bytes deste arquivo e o navegador instala o SW novo.
// Não renomear este arquivo nem mudar o escopo: as inscrições de push dependem dele.
const VERSAO = "__DSB_BUILD__";
const CACHE = "dsb-pwa-" + VERSAO;
const ASSETS = "dsb-astro-v1"; // /_astro/* tem hash no nome: imutável, sobrevive entre deploys
const PRECACHE = [
  "/",
  "/sobre",
  "/busca",
  "/instalar",
  "/notificacoes",
  "/manifest.webmanifest",
  "/favicon.svg",
  "/icon-180.png",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-512-maskable.png",
  "/fila-icon-512.png",
  "/qr.png"
];

self.addEventListener("install", (event) => {
  // Tolerante: uma URL falhando não pode impedir a atualização do SW.
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) =>
        Promise.allSettled(
          PRECACHE.map((u) => cache.add(new Request(u, { cache: "reload" })))
        )
      )
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE && key !== ASSETS).map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  const data = event.data || {};
  if (data.type === "SKIP_WAITING") self.skipWaiting();
  if (data.type === "REFRESH") {
    const target = data.url || self.location.origin + "/";
    event.waitUntil(
      caches.open(CACHE).then((cache) =>
        Promise.all([
          cache.delete(target),
          cache.delete(new URL("/", self.location.origin).href),
          cache.delete(new URL(self.location.origin + new URL(target).pathname).href)
        ])
      )
    );
  }
});

function cacheavel(res) {
  return res && res.ok && res.type === "basic" && !res.redirected;
}

function guarda(nome, req, res) {
  if (cacheavel(res)) {
    const copia = res.clone();
    caches.open(nome).then((cache) => cache.put(req, copia)).catch(() => {});
  }
  return res;
}

// HTML: rede primeiro, cache só offline.
function redePrimeiro(req) {
  return fetch(req)
    .then((res) => guarda(CACHE, req, res))
    .catch(() =>
      caches.match(req).then((hit) => hit || (req.mode === "navigate" ? caches.match("/") : undefined))
        .then((hit) => hit || Response.error())
    );
}

// /_astro/*: cache primeiro (nome com hash nunca muda de conteúdo).
function cachePrimeiro(req) {
  return caches.match(req).then(
    (hit) => hit || fetch(req).then((res) => guarda(ASSETS, req, res))
  );
}

// Imagens/ícones sem hash: devolve o cache na hora e atualiza em segundo plano.
function staleWhileRevalidate(req, event) {
  return caches.match(req).then((hit) => {
    if (hit) {
      // Atualiza em segundo plano; o corpo vai inteiro para o cache (nada fica sem ler).
      event.waitUntil(
        fetch(req)
          .then((res) => (cacheavel(res) ? caches.open(CACHE).then((c) => c.put(req, res)) : null))
          .catch(() => {})
      );
      return hit;
    }
    return fetch(req).then((res) => guarda(CACHE, req, res));
  });
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/") || url.pathname === "/version.json") return;
  if (url.pathname.startsWith("/_astro/")) {
    event.respondWith(cachePrimeiro(req));
    return;
  }
  if (req.mode !== "navigate" && /\.(png|jpe?g|webp|avif|gif|svg|ico|woff2?)$/i.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(req, event));
    return;
  }
  event.respondWith(redePrimeiro(req));
});

// Web Push — payload JSON: { titulo, texto, url, tag? }. Envio: scripts/push/enviar.mjs
self.addEventListener("push", (event) => {
  let d = {
    titulo: "Data Security Briefing",
    texto: "Há um novo briefing no DSB.",
    url: "/",
  };
  try {
    if (event.data) d = { ...d, ...event.data.json() };
  } catch (_) {
    try {
      d.texto = event.data.text();
    } catch (_) {}
  }
  const url = new URL(d.url || "/", self.location.origin);
  const destino =
    url.origin === self.location.origin ? url.href : self.location.origin + "/";
  event.waitUntil(
    self.registration.showNotification(d.titulo, {
      body: d.texto || d.corpo || "",
      icon: "/icon-192.png",
      badge: "/icon-180.png",
      data: { url: destino },
      lang: "pt-BR",
      tag: d.tag || undefined,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((abertas) => {
      for (const c of abertas) {
        if (c.url.startsWith(self.location.origin) && "focus" in c) {
          return c
            .focus()
            .then((f) =>
              f && "navigate" in f ? f.navigate(url) : clients.openWindow(url)
            )
            .catch(() => clients.openWindow(url));
        }
      }
      return clients.openWindow(url);
    })
  );
});
