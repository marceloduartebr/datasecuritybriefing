---
title: "Smart Sampa: nueva falla en proveedora de nube expone 17 mil cámaras conveniadas en SP"
description: "Enlaces de cerca de 17 mil cámaras conveniadas alojadas en Monuv se abrían sin login durante unos cinco días; la Alcaldía habla de planilla sigilosa filtrada y abrió investigación."
pubDate: 2026-11-04T10:16:00-03:00
sourceName: "UOL"
sourceUrl: "https://noticias.uol.com.br/colunas/artur-rodrigues/2026/11/03/nova-falha-no-smart-sampa-permite-acesso-a-17-mil-cameras-conveniadas.htm"
cover: "https://covers.duarte.top/covers/20261104-smart-sampa-17-mil-cameras-monuv.jpg"
tipo: incidente
tags: ["vazamento", "vigilancia", "brasil", "terceiros", "nuvem", "governanca"]
pais: br
notionUrl: "https://www.notion.so/40d1741174738166b948c1c12d65d381"
---

En una línea: Dos semanas después del caso de las 58 mil cámaras, enlaces de 17 mil cámaras conveniadas del Smart Sampa quedaron accesibles sin login en la proveedora Monuv.

## Qué ocurrió

El 3 de noviembre de 2026 el UOL reportó que cerca de 17 mil cámaras conveniadas al Smart Sampa, alojadas en la proveedora de nube Monuv, pudieron ser accedidas sin autenticación durante aproximadamente cinco días, incluyendo calles de autoridades como Alexandre de Moraes, Michel Temer y FHC. Folha confirmó de forma independiente, abriendo transmisiones. La Secretaría Municipal de Seguridad Urbana (SMSU) confirmó que la lista de enlaces es verdadera, afirma que hubo filtración de una planilla sigilosa y abrió investigación. La reportaje sostiene que los enlaces se abrían sin login. El caso es distinto del episodio del 20/10 (credenciales en repositorio público, 58 mil cámaras).

Fuentes adicionales: Folha, O Globo, Veja SP.

## Por qué importa

Las dos versiones convergen en el punto central: el acceso a las cámaras dependía de que el enlace permaneciera secreto. Planilla filtrada o enlace abierto, URL sin autenticación en el proveedor de nube es control de acceso inexistente. Dos incidentes en dos semanas indican falla de gobernanza sobre terceros, no un error aislado.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Acceso sin autenticación | Enlaces se abrían sin login por ~5 días (UOL, Folha) | Alta |
| Exposición de lugares sensibles | Calles de autoridades visualizadas | Alta |
| Riesgo de tercero (nube) | Cámaras alojadas en Monuv | Alta |
| Filtración de inventario | Alcaldía confirma planilla sigilosa filtrada | Media |

## Qué hacer esta semana

1. Inventariar sistemas alojados en terceros que liberan acceso por URL directa o token en enlace — dueño: Seguridad / TI.
2. Exigir a los proveedores de nube autenticación obligatoria y expiración de enlaces de streaming — dueño: Gestión de Terceros.
3. Verificar si planillas con enlaces o credenciales de acceso circulan fuera de cofre — señal: archivos con URLs de acceso en carpetas compartidas.