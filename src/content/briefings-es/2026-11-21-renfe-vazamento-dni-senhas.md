---
title: "Renfe amplía el alcance del ataque de septiembre: DNI, contraseñas e historial de viajes"
description: "Casi dos meses después de decir que el ataque afectó principalmente a nombres y correos, Renfe avisa a sus clientes de que DNI/NIE, contraseñas y datos de viajes pueden haber sido robados."
pubDate: 2026-11-21T08:50:00-03:00
sourceName: "elDiario.es"
sourceUrl: "https://www.eldiario.es/tecnologia/renfe-urge-clientes-cambiar-contrasenas-ciberataque-pudo-robar-dnis-e-historial-viajes_1_13680581.html"
cover: "https://covers.duarte.top/covers/20261121-renfe-vazamento-dni-senhas-0810.jpg"
tipo: incidente
tags: ["renfe", "espanha", "vazamento", "senhas", "terceiros"]
pais: eu
---

En una línea: la primera comunicación hablaba de nombres y correos; la segunda, casi dos meses después, incluye documentos de identidad, contraseñas y desplazamientos.

## Qué ocurrió

Según elDiario.es, la operadora ferroviaria española Renfe envió el 20 de noviembre de 2026 un correo a los clientes afectados por el ciberataque sufrido el 24 de septiembre. La empresa informa de que pueden haber sido robados números de DNI o NIE, contraseñas de acceso e información sobre billetes adquiridos y viajes realizados, y pide cambiar la contraseña cuanto antes, también en otros servicios donde se use la misma.

El 25 de septiembre, Renfe había reconocido la intrusión y dicho que el acceso parecía afectar a información limitada de usuarios, principalmente nombres y direcciones de correo, sin evidencias de acceso a DNI. Ahora, la empresa dice que las contraseñas estaban protegidas con técnicas criptográficas, pero admite que las contraseñas débiles pueden romperse por fuerza bruta. Renfe atribuye el origen del ataque a servidores de Adif previamente comprometidos que mantenían interconexión con sus sistemas, afirma que el presunto autor fue detenido por la Guardia Civil en octubre y que notificó a la Agencia Española de Protección de Datos. La empresa se negó a informar a elDiario.es del número total de clientes afectados.

## Por qué importa

El caso muestra la distancia entre contener un ataque y saber qué alcanzó. El historial de viajes, como reconoce la propia Renfe, permite inferir desplazamientos y perfiles de comportamiento. Y la puerta de entrada fue un entorno interconectado de otra organización, Adif.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
| --- | --- | --- |
| Interconexión con entorno de tercero comprometido | Origen atribuido a servidores de Adif conectados a los sistemas de Renfe | Alta |
| Alcance subestimado en la primera comunicación | Septiembre: nombres y correos; noviembre: DNI/NIE, contraseñas y viajes | Alta |
| Reutilización de contraseñas | Renfe pide cambiarlas también en otros servicios | Media |

## Qué hacer esta semana

1. Inventariar dónde guarda la empresa documentos de identidad, contraseñas e historiales de uso de clientes, por sistema (responsable: Gobierno de Datos).
2. Revisar las conexiones con sistemas de socios y terceros y los datos accesibles a través de ellas (responsable: Seguridad de la Información).
3. Definir en el plan de respuesta a incidentes un proceso para confirmar el alcance por categoría de dato antes de la primera comunicación externa (responsable: DPO y Legal).
