---
title: "Ransomware en CRIBA: constructora argentina-uruguaya en el leak site de DragonForce"
description: "El 24 de agosto DragonForce listó a CRIBA en un sitio de filtraciones. La empresa aún no se pronunció; credenciales de empleados ya circulaban en bases de infostealer."
pubDate: 2026-09-09T10:30:00-03:00
sourceName: "Ransomware.live / HudsonRock"
sourceUrl: "https://ransomware.live/id/Q3JpYmFAZHJhZ29uZm9yY2U="
cover: "https://covers.duarte.top/covers/20260830-criba-ransomware.jpg"
tipo: incidente
tags: ["vazamento", "ransomware", "argentina", "uruguai", "infostealer"]
notionUrl: "https://www.notion.so/3c8174117473817fac62f2605910a63a"
---

**En una línea:** el listado en el leak site llegó después de que credenciales de empleados ya estuvieran a la venta — la señal existía antes del ransomware.

## Qué ocurrió

El 24 de agosto de 2026, el grupo DragonForce incluyó a CRIBA — una de las mayores constructoras de Argentina, con operación también en Uruguay — en su sitio de filtraciones. La reivindicación habla de documentos financieros, datos de clientes e información operacional de proyectos en los dos países. Hasta este briefing, la empresa no se pronunció públicamente sobre alcance ni exfiltración.

Inteligencia de infostealers (HudsonRock) apunta credenciales de al menos dos empleados de CRIBA circulando antes del ataque, además de decenas de cuentas asociadas a la empresa. Un leak site no es confirmación de la víctima.

## Por qué importa

La construcción civil rara vez entra en la conversación de datos. Una constructora que crece país a país suele esparcir contratos, finanzas y padrón de cliente en sistemas locales, cada uno con su propio nivel de protección. La superficie crece sin que alguien lo haya dibujado.

El patrón que se repite no es la falta de antivirus: es no ver credenciales de empleado ya comprometidas meses antes de la fase de ransomware.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Exfiltración | Solo reivindicación en leak site | Indeterminada |
| Credenciales preataque | Infostealer (HudsonRock) | Media |
| Operación AR/UY | Dos países, sin pronunciamiento | Indeterminada |

## Qué hacer esta semana

1. Cruzar cuentas corporativas con bases de infostealer antes de tratar el ransomware como evento aislado — dueño: SecOps.
2. Mapear dónde quedan contrato, finanzas y dato de cliente en cada país — dueño: dueño del dato / DPO.
3. Señal de que funcionó: listar, en horas, qué identidades ya habían filtrado y en qué sistemas aún autentican.
