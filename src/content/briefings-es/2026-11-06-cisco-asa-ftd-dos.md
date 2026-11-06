---
title: "CVE-2026-76418: Cisco ASA/FTD con DoS en SSL VPN entra en el KEV"
description: "CISA añadió el 29 de octubre una falla que permite a un atacante no autenticado reiniciar dispositivos Cisco Secure Firewall con VPN SSL."
pubDate: 2026-11-06T10:18:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/29/cisa-adds-two-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261103-cisco-asa-ftd-dos.jpg"
tipo: vulnerabilidades
tags: ["cve", "cisco", "edge", "kev"]
pais: us
notionUrl: "https://www.notion.so/40d174117473816cbb5ac6f31f0c027b"
---

En una línea: Fallo en el SSL VPN de Cisco ASA y FTD permite DoS no autenticado y entró en el KEV el 29 de octubre.

## Qué ocurrió

El 29 de octubre de 2026 la CISA añadió el CVE-2026-76418 al catálogo KEV. La vulnerabilidad en el Remote Access SSL VPN de Cisco Secure Firewall ASA y FTD permite que un atacante no autenticado fuerce el reinicio del dispositivo. CVSS 8.6. Cisco publicó correcciones el 28 de octubre; no hay workaround. Plazo federal estadounidense: 1 de noviembre de 2026.

## Por qué importa

Dispositivos de perímetro con VPN expuesta concentran el acceso remoto. Un DoS explotado en el KEV interrumpe operaciones antes incluso de cualquier movimiento lateral. La prioridad deja de ser el calendario de parches y pasa a ser la verificación inmediata de versión y evidencia de compromiso previo.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| DoS no autenticado en SSL VPN | CISA KEV + advisory Cisco | Alta |
| Explotación activa | Adición al KEV el 29/10 | Alta |
| Workaround | Ninguno | Alta |

## Qué hacer esta semana

1. Inventariar ASA y FTD con SSL VPN expuesto — dueño: redes / seguridad.
2. Aplicar las versiones corregidas de Cisco — dueño: operaciones.
3. Verificar logs de reinicios anómalos antes del parche — dueño: SOC.
