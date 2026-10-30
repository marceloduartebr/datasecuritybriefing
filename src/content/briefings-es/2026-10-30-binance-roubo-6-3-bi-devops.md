---
title: "Binance: US$ 6,3 mil millones robados desde una laptop de DevOps"
description: "El mayor robo de cripto registrado comenzó en un endpoint de ingeniería comprometido que alcanzó un contenedor de servicio de retiros."
pubDate: 2026-10-30T13:27:00-03:00
sourceName: "Binance / BleepingComputer"
sourceUrl: "https://www.binance.com/en/support/announcement/detail/c5a8729a97ac486d963784d96c5642d7"
cover: "https://covers.duarte.top/covers/20261030-binance-roubo-6-3-bi-devops.jpg"
tipo: incidente
pais: global
tags: ["binance", "cripto", "devops", "endpoint", "coreia-do-norte"]
notionUrl: "https://www.notion.so/40917411747381cba74fea4c1cf09fd0"
---

En una línea: una laptop de ingeniero se convirtió en acceso a un contenedor capaz de enviar retiros — y US$ 6,3 mil millones salieron en unos 20 minutos.

## Qué ocurrió

El 29 de octubre de 2026 un atacante movió cerca de US$ 6,3 mil millones de Binance (TRM Labs estima US$ 6,36 mil millones en diez blockchains, la mayor parte en ~20 minutos a partir de las 20:05 UTC). Es el mayor robo de cripto jamás registrado, cerca de cuatro veces el de Bybit (US$ 1,5 mil millones, feb/2025). Según Binance, la investigación inicial apunta a la laptop comprometida de un ingeniero de DevOps, que dio acceso a un contenedor de servicio usado para enviar retiros no autorizados; después se encontraron "puntos adicionales de intrusión". La empresa afirma que no hay evidencia de filtración de claves privadas de billeteras.

Cerca de US$ 3 mil millones fueron congelados on-chain (Tether ~US$ 971 millones, Circle ~US$ 823 millones). Retiros suspendidos con retorno previsto en ~45 horas; depósitos normales. Binance cubrirá todas las pérdidas con el fondo SAFU y recursos propios y promete un post-mortem y Proof of Reserves actualizado. El co-CEO Richard Teng dijo que no fue "una acción de un clic" y que nadie está siendo culpado individualmente. La atribución al grupo norcoreano TraderTraitor (Lazarus/APT38) es de TRM Labs, con alta confianza — no de Binance.

## Por qué importa

No hubo clave filtrada: el atacante usó la propia infraestructura de retiros. El eslabón débil fue el endpoint de quien administra producción. En cualquier fintech, banco o sistema de pagos instantáneos, el mismo camino — laptop de ingeniería → credencial de servicio → API interna de movimientos — existe y rara vez tiene límite de monto o aprobación doble.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Endpoint de DevOps comprometido | Comunicado de Binance | Alta |
| Contenedor de servicio con poder de retiro | Retiros no autorizados enviados vía servicio | Alta |
| Atribución a Corea del Norte | TRM Labs (tercero), no la víctima | Indeterminada |

## Qué hacer esta semana

1. Mapear qué servicios internos pueden mover dinero y qué laptops alcanzan esos servicios — seguridad + plataforma.
2. Exigir límite de monto, velocidad y aprobación fuera de banda en APIs de movimientos — producto + riesgo.
3. Revisar EDR, acceso privilegiado y sesiones de ingeniería hacia producción — SOC.
