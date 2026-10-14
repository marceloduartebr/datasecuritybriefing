---
title: "El perímetro antiguo vuelve al KEV en la campaña de Integrity Tech"
description: "CISA, FBI y socios marcan ProFTPD, BIND y Struts como explotados el 8/10; el plazo federal espejado es el 11/10."
pubDate: 2026-10-14T10:15:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa26-281a"
cover: "https://covers.duarte.top/covers/20261009-integrity-tech-kev-perimetro.jpg"
tipo: vulnerabilidades
tags: ["kev", "perimetro", "cisa", "integridade"]
pais: us
notionUrl: "https://www.notion.so/3f4174117473813d8ef9cde7bbc14676"
---

En una línea: la campaña habilitada por Integrity Tech recoloca servicios de borde de 2015–2016 en el KEV, con plazo federal corto.

## Qué ocurrió

El 8 de octubre de 2026, CISA, FBI, NSA y socios publicaron el aviso conjunto AA26-281A. El texto atribuye a actores vinculados al gobierno chino, habilitados por Integrity Technology Group, el uso combinado de escaneo automatizado, botnet y explotación manual contra infraestructura crítica de EE.UU. (gobierno, manufactura, salud y tecnología de la información) y organizaciones en América del Norte, el Sudeste Asiático y África. La evidencia provino de investigaciones del FBI.

El apéndice marca con asterisco cinco CVEs recién incluidos en el KEV: CVE-2015-3306 (ProFTPD), CVE-2015-5477 (ISC BIND), CVE-2016-3081 (Apache Struts), CVE-2021-3199 (ONLYOFFICE Docs) y CVE-2023-22894 (Strapi). Espejos del catálogo registran la inclusión el 8/10 y el plazo federal el 11/10. Shellshock, Pulse Connect Secure y GitLab aparecen como explotación ya conocida, sin el asterisco de inclusión nueva.

## Por qué importa

Una política de parches con excepción permanente no es evidencia de que el servicio haya salido del borde. El atacante de esta campaña escanea lo que aún responde.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| ProFTPD 1.3.5 expuesto (CVE-2015-3306) | Asterisco de inclusión en el KEV en el AA26-281A | Alta |
| Struts con Dynamic Method Invocation (CVE-2016-3081) | Mismo apéndice; inyección de comando | Alta |
| BIND antiguo (CVE-2015-5477) | Inclusión en el KEV; denegación de servicio | Media |
| ONLYOFFICE / Strapi | CVE-2021-3199 y CVE-2023-22894 en el mismo lote | Media |

## Qué hacer esta semana

1. Inventariar ProFTPD, BIND, Struts, ONLYOFFICE y Strapi aún alcanzables desde fuera — dueño del perímetro.
2. Desconectar lo que no tiene dueño o aplicar el correctivo antes del 11/10 — dueño de la aplicación.
3. Señal de que funcionó: el escaneo externo ya no devuelve esos servicios en las versiones del apéndice.
