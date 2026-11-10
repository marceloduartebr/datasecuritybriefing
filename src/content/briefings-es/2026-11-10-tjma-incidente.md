---
title: "TJMA confirma salida de datos personales y bancarios de servidores y exservidores"
description: "El tribunal tardó 25 días en comunicar el incidente y aún no dice cuántas personas fueron afectadas, con registros desde 2010 en el mismo entorno."
pubDate: 2026-11-10T10:18:00-03:00
sourceName: "Tribunal de Justiça do Maranhão (TJMA)"
sourceUrl: "https://www.tjma.jus.br/midia/tj/noticia/523759/comunicado-de-incidente-de-seguranca"
cover: "https://covers.duarte.top/covers/20261110-tjma-incidente.jpg"
tipo: incidente
pais: br
tags: ["vazamento", "setor-publico", "lgpd", "retencao", "brasil"]
notionUrl: "https://www.notion.so/41317411747381948299cda0ef2a88eb"
---

En una línea: cuando datos bancarios, filiación y credencial de acceso de exservidores de 2010 están en el mismo entorno de los sistemas activos, el incidente se convierte en un problema de retención, no solo de perímetro.

## Qué ocurrió
En comunicado del 07/11/2026, el TJMA informó que identificó el 13/10/2026 un incidente cibernético en el entorno de los sistemas SISRH, SCO, E-POP y E-SIG, con transferencia externa de archivos que contenían bases de datos. Según el tribunal, se vieron afectados datos de servidores y exservidores (registros desde 2010): nombre, matrícula, CPF e identidad, fecha de nacimiento, dirección, teléfono, correo electrónico, filiación, PIS/PASEP, información bancaria y funcional e información de acceso y autenticación. El TJMA dice que la investigación no confirmó datos sensibles, aisló el servidor, preservó evidencias, accionó a la policía y a la empresa responsable de los sistemas y está comunicando a los titulares. No informó el número de afectados ni el autor. Un post en leak site atribuye el caso a Rhysida, pero lo vincula a un tribunal de Minas Gerais; no hay confirmación.

## Por qué importa
El conjunto de campos permite fraude bancario, apertura de cuentas y phishing dirigido a servidores. La presencia de credenciales de acceso amplía el riesgo para otros sistemas si hay reutilización de contraseña. Y la profundidad histórica (2010) indica bases antiguas sin descarte o segregación.

## Lectura de riesgo
| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Exfiltración de bases de RH | Comunicado del TJMA | Alta |
| Credenciales de acceso filtradas | Comunicado del TJMA | Alta |
| Retención de exservidores desde 2010 | Comunicado del TJMA | Media |
| Atribución a Rhysida | Leak site, no confirmado | Indefinida |

## Qué hacer esta semana
1. Mapear dónde están datos bancarios y de identificación de exfuncionarios y cuál es la base legal para mantenerlos — DPO y RH.
2. Forzar cambio de credenciales de los sistemas de RH y chequear reutilización en otros servicios — TI/IAM.
3. Señal de que funcionó: conseguir responder, por sistema, cuántos titulares y qué campos están expuestos en caso de incidente.

Nota de apuración: fuente no releída en esta etapa; hechos conforme registro del radar DSB el 09/11/2026.