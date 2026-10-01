---
title: "Hospital Clínico de la U. de Chile: la ANCI vio el examen antes que el hospital"
description: "Querella en Santiago después de que la ANCI señaló 120 GB de exámenes de imagenología en un foro. El alcance aún no está cerrado."
pubDate: 2026-10-01T10:12:00-03:00
sourceName: "T13"
sourceUrl: "https://www.t13.cl/noticia/nacional/hospital-clinico-chile-querella-tras-ciberataque-filtracion-informacion-confidencial-30-9-2026"
cover: "https://covers.duarte.top/covers/20261001-hospital-clinico-uchile-imagem.jpg"
tipo: incidente
pais: cl
tags: ["vazamento", "saude", "chile", "terceiro"]
notionUrl: "https://www.notion.so/3ec174117473816d8b73ef6be335a29f"
---

En una línea: el hospital solo confirmó la filtración de exámenes después de que la ANCI señaló el foro.

## Qué ocurrió

El 30 de septiembre de 2026, T13 informó la querella del Hospital Clínico de la Universidad de Chile ante el 3.º Juzgado de Garantía de Santiago, por acceso ilícito y receptación de datos informáticos. La acción describe la intrusión en el Servicio de Imagenología en la plataforma RIS/PACS. La ANCI avisó a la universidad el 20 de septiembre sobre la publicación “Red Clinica Chile 120 GB”. La muestra revisada por el administrador coincidió con pacientes del hospital: RUT, nombre, sexo, edad, fecha de nacimiento, fecha y hora del examen, modalidad, médico solicitante y resultados. El alcance total no quedó cerrado. La cuenta comprometida fue deshabilitada y la consulta externa fue suspendida. El proveedor citado es AGFA.

## Por qué importa

El sistema de imagen quedó fuera del radar interno. La primera evidencia pública vino de la autoridad, no del monitoreo del hospital. El contrato con el proveedor no prueba qué exámenes salieron.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Cuenta de servicio en RIS/PACS | Querella y desactivación de la cuenta | Alta |
| Publicación en foro | Alerta de la ANCI el 20/09; muestra confirmada por el hospital | Alta |
| Tercero (AGFA) | El hospital acudió al proveedor para la contención | Media |
| Alcance total | Aún no determinado en la querella | Indeterminada |

## Qué hacer esta semana

1. Listar cuentas de servicio del RIS/PACS y quién las usa — operación de imagen.
2. Cruzar el log de exportación de exámenes con el inventario de titulares — seguridad y privacidad.
3. Señal: cada exportación fuera de horario tiene dueño y volumen, sin depender de una alerta externa.
