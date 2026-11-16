---
title: "Cisco BroadWorks: XXE sin autenticación entra en el KEV"
description: "CVE-2026-20320 permite lectura de configuración sin login; CISA lo añadió al KEV el 10/11 y Malbear Labs lo vinculó a campaña con agente de IA."
pubDate: 2026-11-16T18:18:00-03:00
sourceName: "SecurityWeek"
sourceUrl: "https://www.securityweek.com/threat-actors-exploit-openwave-cisco-broadworks-vulnerabilities/"
cover: "https://covers.duarte.top/covers/20261112-cisco-broadworks-xxe.jpg"
tipo: vulnerabilidades
tags: ["cve", "kev", "cisco", "xxe", "identidade-nao-humana"]
pais: us
notionUrl: "https://www.notion.so/41617411747381e5bb5eea0fc10141e5"
---

**En una línea:** XXE sin autenticación en Cisco BroadWorks entró en el KEV y ya fue usado por agente de IA contra telecom europeo.

## Qué ocurrió

El 10 de noviembre de 2026 la CISA añadió el CVE-2026-20320 al catálogo KEV. La falla, en el parser OCI de Cisco BroadWorks, permite que un atacante remoto sin autenticación lea información de configuración sensible vía XML externo. El parche (RI.2026.07) salió en agosto. Malbear Labs publicó el 8 de noviembre detalles de una campaña en la que un agente de IA (DeepSeek Flash jailbroken) explotó la falla durante más de dos semanas contra un proveedor de telecom europeo y 13 organizaciones alojadas, extrayendo claves privadas, credenciales y datos de billing.

## Por qué importa

El intervalo entre parche y explotación activa revela que el inventario de versiones y la exposición de la interfaz de aprovisionamiento no son automáticos. Un agente autónomo que adapta táctica reduce la ventana de detección humana.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| XXE sin autenticación en OCI-P | CISA KEV, CVSS 7.5, puerto 2208 | Alta |
| Agente de IA con claves privadas | Malbear Labs, 13 orgs | Alta |
| Parche de agosto aún explotado | Cisco advisory vs. KEV 10/11 | Media |

## Qué hacer esta semana

1. Inventariar instancias BroadWorks y confirmar versión ≥ RI.2026.07 — equipo de red/voz.
2. Restringir acceso a OCI-P (puerto 2208) a redes de gestión — equipo de firewall.
3. Revisar logs de XML anómalo y claves extraídas — SOC.
