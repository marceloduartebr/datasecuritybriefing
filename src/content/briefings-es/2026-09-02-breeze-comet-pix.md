---
title: "BREEZE COMET opera Pix, STR y boleto desde dentro de las empresas brasileñas"
description: "GTIG y Mandiant describen un actor financiero que entra en bancos, procesadoras y fintechs en Brasil para emitir órdenes en el riel de pago — no para robar el padrón."
pubDate: 2026-09-02T10:12:00-03:00
sourceName: "Google Cloud / GTIG / Mandiant"
sourceUrl: "https://cloud.google.com/blog/topics/threat-intelligence/financially-motivated-threat-actor-breeze-comet-targets-brazil/"
cover: "https://covers.duarte.top/covers/20260901-breeze-comet-pix.jpg"
tipo: incidente
tags: ["fraude", "pix", "brasil", "identidade", "dspm"]
notionUrl: "https://www.notion.so/3ce17411747381db8b17d6e852ed4972"
---

**En una línea:** el blanco no es el PII del cliente; es la identidad capaz de firmar un Pix, un STR o una remesa.

## Qué ocurrió

El martes (1/09/2026), Google Threat Intelligence Group y Mandiant describieron a BREEZE COMET — actor con motivación financiera que, desde 2024, compromete bancos, procesadoras, retail y fintechs en Brasil para operar el riel de pago desde dentro.

El recorte no es el padrón del titular. Son organizaciones con permiso de transaccionar: Pix, STR y boleto. En al menos un caso el grupo llegó a la Red Nacional del Sistema Financiero y, en 24 a 48 horas, disparó dos oleadas con cientos de órdenes fraudulentas. Google confirma al menos un golpe en la casa de las decenas de miles de dólares.

El camino público rara vez empieza en el malware. Empieza en ingeniería social (llamada haciéndose pasar por soporte de TI), sitio comprometido sirviendo instalador o acceso remoto “para resolver un ticket”. Solo después entra el kit propio y la búsqueda en el directorio por términos de remesa, CNAB y webhook de Pix. Un modelo de lenguaje acelera el guion; no inventa el golpe.

## Por qué importa

Quien mapea solo dato personal y olvida certificado, cuenta de servicio y cola de remesa descubre el incidente en el extracto. El activo que salió no estaba en el inventario de PII. Estaba en la identidad con poder de emitir orden.

El inventario de titular no sustituye el inventario de quién — humano o máquina — puede firmar una transferencia.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Acceso inicial por ingeniería social / remoto | Descrito por GTIG/Mandiant | Alta |
| Emisión de Pix/STR/boleto desde identidad interna | Confirmado en al menos un caso (RNSF, dos oleadas) | Alta |
| Uso de LLM en el guion del golpe | Citado como acelerador, no como origen | Media |

## Qué hacer esta semana

1. Listar identidades (humanas y de servicio) con permiso de emitir Pix, STR o remesa CNAB — dueño: tesorería + IAM.
2. Marcar cuentas huérfanas, compartidas o sin dueño claro en esa lista y suspender hasta evidencia de necesidad — dueño: IAM.
3. Señal de que funcionó: cualquier orden atípica en el riel apunta a una identidad nombrada, no a “el sistema de pago”.
