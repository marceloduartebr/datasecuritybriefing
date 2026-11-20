---
title: "Supply chain — Perforce Puppet Enterprise entra en el KEV con RCE por deserialización de informes"
description: "La CISA añadió el 17/11 el CVE-2026-115731, que permite ejecutar código en el servidor Puppet a partir de cualquier certificado de agente firmado."
pubDate: 2026-11-20T12:52:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/17/cisa-adds-one-known-exploited-vulnerability-catalog"
cover: "https://covers.duarte.top/covers/20261118-perforce-puppet-kev.jpg"
tipo: vulnerabilidades
tags: ["cve", "kev", "supply-chain", "puppet", "eua"]
pais: us
---

En una línea: Un certificado de agente firmado basta para ejecutar código en el servidor que firma la confianza de toda la flota.

## Qué ocurrió

El 17 de noviembre de 2026 la CISA incluyó el CVE-2026-115731 (deserialización de datos no confiables en el procesamiento de informes de Puppet) en el catálogo KEV. La falla permite que un cliente con cualquier certificado firmado por la CA de Puppet envíe un informe malicioso y ejecute código en el servidor con los privilegios del usuario de servicio. El parche se publicó el 3 de noviembre; la explotación se señaló el 4 de noviembre. Si la CA hace autosign sin una verificación fuerte, el vector pasa a ser no autenticado.

## Por qué importa

Las herramientas de gestión de configuración llevan la llave que define lo que recibe cada sistema. Comprometer el servidor Puppet no se queda en el propio host: el atacante puede emitir certificados y alterar lo que se entregará en el próximo ciclo. El inventario de certificados de agente y la política de autosign son controles de superficie, no solo de parche.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| RCE vía informe firmado | KEV + aviso de Perforce + SecurityWeek | Alta |
| Autosign sin verificación | Descripción del CNA / CISA | Alta si está habilitado |
| Compromiso de la CA | Aviso de Perforce | Alta |

## Qué hacer esta semana

1. Inventariar los Puppet Servers y sus versiones (Enterprise y Core) — responsable: plataforma.
2. Confirmar si el autosign está deshabilitado o con verificación fuerte — responsable: identidad/infra.
3. Aplicar los parches 2026.0.1 / 2025.12.1 / 2023.8.13 o equivalentes y reiniciar el servicio — responsable: plataforma.
