const CACHE = "dsb-pwa-v26";
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
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
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

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match("/")))
  );
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
