---
title: "TJMT: ataque derriba el PJe y expone credenciales de usuarios"
description: "La inserción indebida de un modelo de documento abrió la brecha; se accedió a logins y contraseñas cifradas y los plazos quedaron suspendidos del 23 al 25 de septiembre."
pubDate: 2026-09-28T10:14:00-03:00
sourceName: "Convergência Digital"
sourceUrl: "https://convergenciadigital.com.br/seguranca/no-tribunal-do-mato-grosso-hackers-usam-brecha-para-acessar-logins-e-senhas-criptografadas-dos-usuarios/"
cover: "https://covers.duarte.top/covers/20260925-tjmt-incidente.jpg"
tipo: incidente
tags: ["incidente", "credenciais", "poder judiciario", "brasil", "continuidade"]
notionUrl: "https://www.notion.so/3e6174117473810a9f3cd611b0384003"
---

**En una línea:** un modelo de documento insertado indebidamente el domingo abrió la brecha que derribó los sistemas del Tribunal de Justicia de Mato Grosso y expuso logins y contraseñas cifradas de usuarios.

## Qué ocurrió

Según la Coordinación de Tecnología de la Información (CTI) del TJMT, la inserción indebida de un modelo de documento en el sistema, la tarde del domingo (20/09/2026), abrió una brecha en la estructura. Los atacantes explotaron esa falla, accedieron a la red y derribaron los servicios el lunes (21). El Tribunal sacó del aire los principales sistemas institucionales, incluido el Proceso Judicial Electrónico (PJe).

En nota publicada el miércoles (23), el TJMT confirmó que se accedió a logins y contraseñas cifradas de usuarios. Hasta el momento, afirma el Tribunal, no hay evidencias de acceso a otros datos personales de servidores y magistrados, a decisiones judiciales o a los respaldos. Todas las contraseñas están siendo redefinidas y los accesos sensibles fueron restringidos, con apoyo de socios especializados.

La Portaria TJMT/PRES del 22/9/2026 suspendió el expediente el día 23 para pruebas y homologación y mantuvo solo expediente interno los días 24 y 25, con atención al público en régimen de guardia. Los plazos procesales están suspendidos del 23 al 25 de septiembre, audiencias y sesiones serán reprogramadas, y el peticionamiento y la consulta procesal siguen indisponibles. La ejecución penal funciona normalmente por el SEEU, que no fue afectado. Los sistemas volverán de forma gradual, después de pruebas.

## Por qué importa

Según el propio relato del Tribunal, la puerta de entrada fue un contenido insertado indebidamente en el sistema. Modelos de documento, macros y plantillas suelen quedar fuera de la gestión de cambios, y es exactamente por eso que se convierten en puerta de entrada.

El segundo punto es la credencial. Una contraseña cifrada a la que se accedió sigue siendo una credencial expuesta: el riesgo depende del algoritmo, del sal y de la velocidad de la redefinición. Para un tribunal, la indisponibilidad tiene costo directo sobre plazos, audiencias y acceso a la Justicia, lo que hace que la continuidad sea tan importante como la confidencialidad.

## Lectura de riesgo

| Dimensión | Evaluación |
|---|---|
| Vector inicial | Inserción indebida de modelo de documento en el sistema (domingo, 20/09) |
| Datos expuestos | Logins y contraseñas cifradas de usuarios de la red |
| Datos personales, decisiones y respaldos | Sin evidencia de acceso hasta el momento, según el TJMT |
| Impacto operacional | Alto: PJe y sistemas fuera de servicio, plazos suspendidos del 23 al 25/09 |
| Contención | Redefinición de todas las contraseñas y restricción de accesos sensibles |
| Riesgo residual | Medio: reuso de credenciales y retorno gradual aún en prueba |

## Qué hacer esta semana

1. Ponga modelos de documento, macros y plantillas bajo gestión de cambios: dueño definido, revisión antes de producción y registro de quién insertó qué y cuándo.
2. Revise el almacenamiento de contraseñas (algoritmo y sal), exija MFA en los accesos a la red y configure alerta para login fuera de patrón tras cualquier redefinición masiva.
3. Señal de que funcionó: una inserción de plantilla fuera de horario o sin aprobación genera alerta el mismo día, y usted sabe listar qué servicios críticos siguen operando si cae la red principal.
