---
title: "UnrealIRCd en el KEV: cualquier usuario puede comandar la red"
description: "La CISA añadió el CVE-2026-114713 al KEV el 13/11. Una falla en labeled-response permite inyectar comandos S2S con autoridad de servidor."
pubDate: 2026-11-18T18:10:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/13/cisa-adds-two-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261116-unrealircd-kev-command-injection.jpg"
tipo: vulnerabilidades
pais: us
tags: ["cve", "kev", "unrealircd", "perimetro"]
---

En una línea: la confianza entre servidores enlazados se convierte en el vector cuando el contenido de la etiqueta no se sanea.

## Qué ocurrió

El 13 de noviembre de 2026, la CISA incluyó el CVE-2026-114713 en el catálogo KEV. La falla está en el módulo labeled-response de UnrealIRCd 6.0.0 hasta antes de 6.2.7.1. Cualquier usuario en una red con dos o más servidores enlazados puede inyectar saltos de línea en la etiqueta IRCv3 "label" y hacer que comandos servidor a servidor se ejecuten con autoridad de servidor. El proyecto calificó la falla como la más crítica en 15 años. Corrección en la 6.2.7.1 o en el hot-patch bundle-20261107. Plazo de la CISA: 16 de noviembre.

## Por qué importa

El punto ciego es la confianza implícita en el tráfico entre nodos. La política de parches no genera evidencia de que el hot-patch se aplicó en todos los servidores de la malla.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Inyección S2S vía etiqueta label | KEV + aviso del fabricante | Alta |
| Explotación activa | CISA SSVC: active | Alta |
| Hot-patch disponible | Fabricante | Media (depende de la aplicación) |

## Qué hacer esta semana

1. Inventariar las instancias de UnrealIRCd 6.x con servidores enlazados — responsable: infraestructura de comunicación.
2. Aplicar el hot-patch o la actualización y confirmar el rehash en todos los nodos — responsable: operaciones.
3. Verificar si se aplicó el workaround de spamfilter mientras no llega el parche — responsable: seguridad.
