---
title: "Microsoft: atacantes usan framework agéntico para hallar secretos en GitHub y exfiltrar datos del Azure Key Vault"
description: "En un caso, la cadena desde la credencial expuesta hasta la exfiltración tomó cinco minutos, demasiado rápido para cualquier reacción humana."
pubDate: 2026-11-11T10:22:00-03:00
sourceName: "Microsoft Threat Intelligence"
sourceUrl: "https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/"
cover: "https://covers.duarte.top/covers/20261109-microsoft-artex-segredos.jpg"
tipo: noticia
pais: us
tags: ["identidade-nao-humana", "ia", "segredos", "nuvem"]
notionUrl: "https://www.notion.so/411174117473819992b1ca5da2b06a8a"
---

En una línea: Con agentes ofensivos automatizando desde el descubrimiento del secreto hasta la exfiltración, la defensa debe estar en el inventario de identidades no humanas, no en el tiempo de reacción.

## Qué ocurrió

El 5 de noviembre de 2026, Microsoft Threat Intelligence reportó que actores de amenaza usan el framework agéntico ARTEX para encontrar y abusar de secretos expuestos. Según la empresa, el escaneo de secretos en GitHub ocurre desde agosto, y desde el 28 de octubre se observaron sign-ins de service principals con credenciales robadas. En un caso, el agente fue del escaneo en GitHub a la exfiltración de datos del Azure Key Vault en cinco minutos. La publicación no nombra víctimas.

## Por qué importa

Las identidades no humanas, como service principals, suelen tener permisos amplios y poca revisión. Cuando el atacante encadena descubrimiento, autenticación y exfiltración de forma automática, la ventana entre exposición y pérdida desaparece. El control eficaz pasa a ser preventivo: no exponer secretos y limitar lo que cada identidad alcanza.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Secretos expuestos en repositorios GitHub | Microsoft Threat Intelligence, 5 de noviembre | Alta |
| Sign-ins de service principals con credenciales robadas desde 28/10 | Microsoft Threat Intelligence | Alta |
| Exfiltración del Key Vault en cinco minutos | Caso descrito por Microsoft | Alta |

## Qué hacer esta semana

1. Inventariar service principals con acceso a Key Vault y a datos sensibles, y remover permisos sin uso — responsable: identidad / cloud.
2. Rotar secretos encontrados en repositorios y activar alertas de sign-in anómalo para identidades no humanas — responsable: SOC.
3. Señal de que funcionó: cada service principal tiene dueño, alcance mínimo documentado y revisión periódica.
