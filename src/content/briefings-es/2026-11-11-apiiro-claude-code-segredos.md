---
title: "Apiiro encuentra 2.539 secretos expuestos en GitHub por archivo de permisos de agente de código"
description: "Una opción de conveniencia de un agente de código graba credenciales en un archivo que termina en el repositorio, y nadie decidió publicarlas."
pubDate: 2026-11-11T18:18:00-03:00
sourceName: "Apiiro"
sourceUrl: "https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again"
cover: "https://covers.duarte.top/covers/20261109-apiiro-claude-code-segredos.jpg"
tipo: noticia
pais: us
tags: ["shadow-ai", "identidade-nao-humana", "segredos", "devsecops"]
notionUrl: "https://www.notion.so/411174117473815aba41c705a2625861"
---

En una línea: Los agentes de código crean artefactos con credenciales fuera de cualquier inventario; la investigación de Apiiro da la escala del problema.

## Qué ocurrió

El 5 de noviembre de 2026, Apiiro (investigación de vendor) publicó que la opción "don't ask again" de Claude Code graba el comando aprobado, incluyendo contraseñas o tokens presentes en él, en el archivo .claude/settings.local.json. Cuando el archivo se versiona, el secreto va al repositorio. La empresa afirma haber encontrado 2.539 secretos reales en 1.994 repositorios públicos, de 63 organizaciones, y que una de ellas confirmó que la clave estaba activa. The Hacker News repercutió el estudio el 7 de noviembre.

## Por qué importa

El riesgo no está solo en el código que el agente escribe, sino en los archivos de configuración, logs y cachés que crea. Estos artefactos quedan fuera de los controles tradicionales de datos sensibles y de secretos, y llegan a repositorios públicos sin decisión consciente de nadie.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Credenciales grabadas en archivo de permisos del agente | Investigación de Apiiro, 5 de noviembre | Alta |
| Clave expuesta confirmada como activa | Investigación de Apiiro | Alta |
| Escala en repositorios públicos (63 organizaciones) | Investigación de Apiiro; The Hacker News | Media |

## Qué hacer esta semana

1. Barrer repositorios en busca de archivos de configuración de agentes de código e incluirlos en el .gitignore — dueño: ingeniería de plataforma.
2. Rotar cualquier credencial encontrada en esos archivos y activar barrido de secretos en el pipeline — dueño: AppSec.
3. Señal de que funcionó: el barrido de secretos pasa a cubrir los directorios creados por agentes de IA, sin hallazgos nuevos por dos semanas.
