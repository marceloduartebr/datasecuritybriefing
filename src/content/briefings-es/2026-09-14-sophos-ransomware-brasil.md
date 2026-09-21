---
title: "Sophos: el rescate mediano en Brasil sube 63% y llega a US$ 640 mil"
description: "El pedido mediano de ransomware en Brasil alcanza US$ 640 mil en 2025; el pago cae al 45% y el 74% de los casos pasa por identidad."
pubDate: 2026-09-14T10:20:00-03:00
sourceName: "Estadão / Sophos"
sourceUrl: "https://www.estadao.com.br/tecmundo/ciberseguranca/resgates-ransomware-sobem-no-brasil/"
cover: "https://covers.duarte.top/covers/20260909-sophos-ransomware-brasil.jpg"
tipo: noticia
tags: ["ransomware", "identidade", "brasil", "backup"]
notionUrl: "https://www.notion.so/3d617411747381ce9c4dca448de9d24a"
---

En una línea: el pedido mediano sube, el pago cae, y el vector deja de ser falla técnica para ser credencial.

## Qué ocurrió

El 9/09/2026 el Estadão publicó el recorte del informe anual de Sophos sobre ransomware en Brasil (datos de 2025). El valor mediano exigido llegó a US$ 640 mil (cerca de R$ 3,27 millones), un alza del 63%. Brasil lideró el ranking global de invasiones iniciadas por correo (37% de los casos). La explotación de fallas técnicas cayó del 44% al 24%. En el 74% de las organizaciones alcanzadas el golpe tuvo ligazón con identidad y robo de credencial. La parcela que pagó el rescate retrocedió del 66% al 45%. El 85% de las víctimas recurió a backup para recuperar archivos, contra el 73% en el recuento anterior.

## Por qué importa

Un backup aislado no es lo mismo que un plan de continuidad ensayado. La doble extorsión sigue presionando por el dato, no solo por la indisponibilidad. El nexo local es inventario de identidad — cuenta de servicio, token de backup y admin del directorio — y evidencia de restauración, no solo una política escrita.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Identidad / credencial | El 74% de los alcanzados ligó el golpe a ese vector (Sophos / Estadão) | Alta |
| Correo malicioso | Brasil 1.º en el ranking global; 37% de los casos | Alta |
| Falla técnica | Retroceso del 44% al 24% | Media |
| Continuidad / backup | El 85% restauró por copia; madurez (aislamiento, prueba, RTO) no medida | Indeterminada |

## Qué hacer esta semana

1. Mapear cuentas de servicio y credenciales de backup fuera del mismo directorio de producción — dueño: identidad / IAM.
2. Correr una prueba de restauración de punta a punta con RTO anotado — dueño: continuidad.
3. Señal de que funcionó: el equipo puede decir, sin abrir un ticket, qué credencial abre el backup y si sobrevive a un compromiso del AD.
