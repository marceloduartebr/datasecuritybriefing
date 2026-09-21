---
title: "ReliaQuest contiene el vishing de ShinyHunters con controles de confianza de dispositivo"
description: "La ingeniería social por teléfono abrió el panel de identidad de un colaborador — y se detuvo ahí, gracias al device trust."
pubDate: 2026-09-11T10:36:00-03:00
sourceName: "The Register"
sourceUrl: "https://www.theregister.com/cyber-crime/2026/08/24/shinyhunters-and-reliaquest-trade-blows-over-claimed-breach/529170"
cover: "https://covers.duarte.top/covers/20260830-reliaquest-vishing.jpg"
tipo: incidente
tags: ["vishing", "identidade", "mfa", "shinyhunters", "device-trust"]
notionUrl: "https://www.notion.so/3c71741174738130aa29eb888ea2d403"
---

**En una línea:** La ingeniería social por teléfono abrió el panel de identidad de un colaborador — y se detuvo ahí, gracias a controles de confianza de dispositivo.

## Qué ocurrió

El 22 de agosto de 2026, el grupo de extorsión ShinyHunters registró dominios parecidos al nombre de ReliaQuest, armó una página falsa de login SSO y llamó a empleados haciéndose pasar por el equipo interno de seguridad. Un colaborador tecleó la contraseña y aprobó la notificación de MFA. El invasor consiguió, por algunos minutos, acceso de solo lectura al panel Okta de esa identidad. Ningún sistema o aplicación de la empresa fue alcanzado y ningún dato de cliente fue tocado: los controles de confianza de dispositivo bloquearon cualquier avance, la sesión se cerró y las credenciales se cambiaron. Aun así, ShinyHunters listó a ReliaQuest como víctima en su sitio de filtraciones — lo que la empresa contesta en público.

## Por qué importa

La diferencia crítica no está en el ataque en sí. La ingeniería social por teléfono sigue siendo una de las tácticas más simples y eficaces, inclusive contra quien trabaja con seguridad todos los días. La diferencia está entre “un empleado cayó en el golpe” y “la empresa fue comprometida”. Esas dos cosas casi nunca son lo mismo, pero se vuelven titular como si lo fueran.

Medir madurez de seguridad por la cantidad de capas de autenticación — y no por la claridad sobre lo que cada capa realmente protege — sigue siendo un error común. Un MFA aprobado no debería significar acceso irrestricto; debería significar acceso a exactamente aquello que esa identidad necesita, nada más.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Vishing + página SSO falsa | Confirmado por ReliaQuest y por la cobertura de The Register | Alta (vector de entrada) |
| Acceso al panel Okta (solo lectura) | Confirmado; duración de minutos | Media |
| Movimiento lateral / datos de clientes | Bloqueado por device trust; ningún dato tocado | Contenida |
| Listado en leak site | Publicado por el grupo; contestado por la víctima | Indeterminada (reputacional) |

## Qué hacer esta semana

1. Revisar si un MFA aprobado concede solo el mínimo necesario para esa identidad — dueño: identidad/IAM.
2. Probar si los controles de confianza de dispositivo (device trust / conditional access) realmente impiden el avance desde una sesión comprometida — dueño: seguridad de endpoint + IAM.
3. Entrenar al equipo a tratar una llamada “del propio SOC” como sospechosa hasta confirmación por canal secundario — dueño: concientización.
4. Señal de que funcionó: un incidente similar termina en la misma pantalla, sin acceso a sistemas o datos.
