---
title: "IBM Aspera Faspex: bypass de autorización que da admin entra en el KEV"
description: "Fallo explotado da privilegio total en una plataforma que guarda archivos intercambiados entre empresas."
pubDate: 2026-11-12T10:20:00-03:00
sourceName: "IBM"
sourceUrl: "https://www.ibm.com/support/pages/node/7295921"
cover: "https://covers.duarte.top/covers/20261110-ibm-aspera-faspex-kev.jpg"
tipo: vulnerabilidades
pais: us
tags: ["kev", "ibm", "transferencia-de-arquivos", "retencao", "perimetro"]
notionUrl: "https://www.notion.so/41317411747381958fe3c44e63c0cc2d"
---

En una línea: admin en una plataforma de transferencia de archivos es acceso al historial de datos que nadie limpió.

## Qué ocurrió

La CISA incluyó el 09/11/2026 el CVE-2026-123218 de IBM Aspera Faspex en el KEV, con base en evidencia de explotación activa. El boletín de IBM del 07/11/2026 dice que Faspex 5 permite que un usuario cree un mensaje específico para eludir la autorización y obtener privilegios totales de administrador (CWE-863). Afecta de 5.0.0 a 5.0.19; corrección en 5.0.19 PL1 (Linux), sin workaround. CVSS 9,8 según IBM; EPSS 0,4% el 09/11.

## Por qué importa

Las plataformas de transferencia de archivos acumulan contratos, extracciones de bases y datos de socios. El daño de un admin indebido es proporcional a lo que quedó retenido.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Bypass de autorización para admin | KEV 09/11/2026; boletín IBM | Crítica |
| Datos retenidos en la plataforma | Depende de la política de retención | Alta |

## Qué hacer esta semana

1. Actualizar a 5.0.19 PL1 — dueño: infraestructura.
2. Revisar cuentas admin y logs de acceso desde la divulgación — dueño: SOC.
3. Señal de que funcionó: versión corregida en producción y política de retención aplicada a los paquetes antiguos.
