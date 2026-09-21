---
title: "Cero contraseñas rotas: OAuth y vinculación de WhatsApp en el espionaje ruso"
description: "GTIG apunta a UNC6293 (ligado a APT29), UNC7005 y UNC5976 usando login verdadero de Google/Microsoft y secuestro de dispositivo WhatsApp."
pubDate: 2026-08-28T18:10:00-03:00
sourceName: "The Hacker News / Google Threat Intelligence Group"
sourceUrl: "https://thehackernews.com/2026/08/suspected-russian-hackers-abuse-google.html"
cover: "https://covers.duarte.top/covers/20260828-oauth-whatsapp-apt.jpg"
tags: ["identidade", "oauth", "espionagem"]
notionUrl: "https://www.notion.so/3c717411747381cfbde6e58e7b80cf55"
---

**En una línea:** la pantalla de login era genuina; el token es el que cambió de dueño.

## Qué ocurrió

Google Threat Intelligence Group describe tres clusters ligados a Rusia — UNC6293 (asociado a APT29/Cozy Bear), UNC7005 y UNC5976 — secuestrando cuentas en gobierno, defensa, aeroespacial, academia y think tanks en Europa y EE. UU. La táctica usa el flujo real de “Iniciar sesión con Google” o Microsoft y redirige a un proyecto de nube malicioso que captura el token. Otra variante abusa de la vinculación de dispositivos de WhatsApp.

No hay contraseña rota ni exploit de día cero en el relato.

## Por qué importa

Un token válido abre las mismas puertas que el usuario real. Control de acceso ≠ visibilidad sobre el dato que ese token lee.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Fraude de consentimiento OAuth | GTIG / THN | Alta |
| Vinculación de dispositivo WhatsApp | GTIG / THN | Alta |

## Qué hacer esta semana

1. Revisar apps OAuth concedidas (Google Workspace / Entra) y revocar lo que no tenga dueño — identidad.
2. Tratar el “dispositivo vinculado” del mensajero como control de acceso, no como detalle de TI.
3. Señal de que funcionó: se puede listar lo que alcanza el token de un director.
