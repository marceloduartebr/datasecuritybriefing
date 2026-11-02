---
title: "Edge — VMware ESX logging insuficiente en el KEV (CVE-2026-41709)"
description: "CISA añadió CVE-2026-41709 al KEV; Warp Panda usó la falla de logging como zero-day en objetivos estadounidenses."
pubDate: 2026-11-02T10:17:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/28/cisa-adds-two-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261029-edge-vmware-esx-kev.jpg"
tipo: vulnerabilidades
tags: ["cve", "kev", "vmware", "edge"]
pais: us
notionUrl: "https://www.notion.so/408174117473813ebb08eee4aa94726d"
---

**En una línea:** Logging insuficiente en ESX permite operaciones admin sin rastro y ya fue usado como zero-day por actor de nexo chino.

## Qué ocurrió

El 28 de octubre de 2026 la CISA incluyó el CVE-2026-41709 en el catálogo KEV. La vulnerabilidad, de CVSS 2.7, permite que un atacante con privilegio administrativo en Broadcom VMware ESX ejecute determinadas operaciones sin que queden registradas. CrowdStrike documentó el uso como zero-day por el grupo Warp Panda en intrusiones a organizaciones de EE.UU., incluyendo el sector jurídico, para borrar o reducir la traza de auditoría. El acceso inicial suele ocurrir por dispositivos de borde; el pivote es vCenter. Hay parches desde el advisory del 29 de julio. Plazo federal de remediación: 11 de noviembre de 2026.

## Por qué importa

La falla no da acceso inicial; elimina la evidencia de lo que hizo el acceso privilegiado. En entornos donde el log del hipervisor es la principal fuente forense, la ausencia de registro transforma la política de acceso en suposición.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Logging insuficiente (CVE-2026-41709) | KEV 28/10; zero-day Warp Panda en objetivos US | Alta |
| Acceso admin residual | Operaciones sin rastro en ESX | Alta |
| Cadena con borde | Entrada por edge devices + pivote vCenter | Alta |

## Qué hacer esta semana

1. Verificar versión de todos los hosts ESX/ESXi, Cloud Foundation y vSphere Foundation contra las builds corregidas (ESXi-9.1.0.0-25370933, ESXi-9.0.2.0100-25595025, ESXi80U3j-25429389 o superiores) — dueño: virtualización.
2. Revisar logs de administración de vCenter y ESX de los últimos 90 días en busca de lagunas inexplicables y validar integridad de la traza — dueño: detección / forense.
3. Señal de que funcionó: inventario de hosts desactualizados en cero y alerta de cobertura de log en el hipervisor activo.
