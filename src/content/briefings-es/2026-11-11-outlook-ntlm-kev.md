---
title: "Outlook: falla explotada que filtra hash NTLMv2 entra en el KEV"
description: "CISA añadió el CVE-2026-124194 el 10 de noviembre. Un archivo de mensaje hace que Outlook se conecte a un servidor del atacante sin el aviso de contenido externo."
pubDate: 2026-11-11T10:20:00-03:00
sourceName: "Microsoft (MSRC) e CISA"
sourceUrl: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-124194"
cover: "https://covers.duarte.top/covers/20261111-outlook-ntlm-kev.jpg"
tipo: vulnerabilidades
pais: us
tags: ["kev", "cve", "microsoft", "outlook", "ntlm", "identidade"]
notionUrl: "https://www.notion.so/41417411747381909665ddff9c3c22bc"
---

En una línea: abrir un archivo de mensaje en Outlook basta para entregar el hash NTLMv2 del usuario a un servidor del atacante.

## Qué ocurrió

En el Patch Tuesday del 10 de noviembre de 2026, Microsoft corrigió el CVE-2026-124194, falla de spoofing en Outlook marcada como "Exploitation Detected" — el único zero-day explotado entre los 1.094 CVEs del mes. Según el MSRC, un atacante no autenticado envía un archivo de mensaje especialmente creado y convence al usuario de abrirlo; Outlook entonces se conecta a una ubicación de red controlada por el atacante sin mostrar el aviso de contenido externo, exponiendo el hash NTLMv2 del usuario, que puede usarse para autenticarse como él. El Panel de Vista Previa no es vector; se requiere interacción del usuario. Severidad Moderada, CVSS 3.1 6,5. Afecta a Microsoft 365 Apps for Enterprise, Office LTSC 2021 y Office LTSC 2024; la corrección viene en la actualización de Office, no en el acumulativo de Windows. El mismo día, CISA incluyó la falla en el KEV.

## Por qué importa

La nota 6,5 engaña. Lo que sale no es un dato cualquiera, es una credencial: con el hash NTLMv2, el atacante puede romperlo offline o hacerse pasar por el usuario en servicios que aún aceptan NTLM, y a partir de ahí llegar a correo, archivos y bases internas. El phishing con adjunto sigue siendo la puerta, y el control que falla es el aviso que el usuario debería ver.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Archivo de mensaje malicioso abierto en Outlook | MSRC, Exploitation Detected | Alta |
| Filtración del hash NTLMv2 y uso para autenticación | MSRC | Alta |
| Corrección solo en la actualización de Office | MSRC / notas de Office | Media |

## Qué hacer esta semana

1. Aplicar la actualización de seguridad de Microsoft 365 Apps y de Office LTSC 2021/2024 — responsable: endpoint/TI. El acumulativo de Windows no corrige.
2. Bloquear NTLM de salida a internet (SMB/WebDAV) y avanzar en la restricción de NTLM donde sea posible — responsable: identidad/red.
3. Señal de que funcionó: no hay conexiones SMB o WebDAV de estaciones a IPs externas en los logs después del parche.
