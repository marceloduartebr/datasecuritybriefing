---
title: "FreeSWITCH: code injection via SIP MESSAGE entra al KEV"
description: "CISA añadió el CVE-2026-116779 el 9 de noviembre. Un mensaje SIP puede ejecutar comandos de sistema en FreeSWITCH hasta 1.11.2."
pubDate: 2026-11-13T10:20:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/09/cisa-adds-four-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261110-freeswitch-kev.jpg"
tipo: vulnerabilidades
tags: ["voip", "kev", "cve", "freeswitch", "eua"]
pais: us
notionUrl: "https://www.notion.so/41417411747381bd95b4dd90e1b6ef9b"
---

En una línea: Softswitch FreeSWITCH hasta 1.11.2 ejecuta comando de sistema a partir de un SIP MESSAGE.

## Qué ocurrió

El 9 de noviembre de 2026 la CISA incluyó el CVE-2026-116779 en el KEV. La falla, documentada en el advisory GHSA-mg63-h38w-8p9p de SignalWire, permite que un peer que entrega un SIP MESSAGE a un perfil seleccione el chat proto “api” y ejecute switch_api_execute. Resultado: ejecución de comandos de la API de FreeSWITCH y de sinks de sistema operativo con los privilegios del proceso. Afecta versiones ≤ 1.11.2; el predeterminado habilita chat inbound. Explotación observada en la wild. Corrección en 1.11.3 cierra la ruta por defecto (enable-chat-api-proto off).

## Por qué importa

Borde de voz y softswitch todavía se tratan como “solo telefonía”. El parser de protocolo decide qué ejecutar antes de cualquier control de aplicación. Inventario de superficie SIP expuesta y de versiones de FreeSWITCH/Asterisk es precondición para saber si la política de acceso tiene evidencia técnica.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| SIP MESSAGE para proto api | Advisory + KEV 09/11 | Alta |
| Perfil predeterminado con chat inbound | Documentación SignalWire | Alta |
| Ejecución con privilegio del proceso | GHSA y NVD | Alta |

## Qué hacer esta semana

1. Inventariar FreeSWITCH ≤ 1.11.2 con perfil SIP accesible desde fuera — dueño: red/voz.
2. Actualizar a 1.11.3 o deshabilitar enable-chat donde no sea necesario — dueño: plataforma.
3. Revisar logs de SIP MESSAGE sospechosos y de ejecución de API en el período anterior al parche — dueño: SOC.
