---
title: "Baker Tilly notifica filtración de SSN en la plataforma de un proveedor"
description: "Datos de clientes y dependientes salieron del entorno de un tercero; la empresa aún no divulgó el total de afectados."
pubDate: 2026-11-17T15:50:00-03:00
sourceName: "SC Media"
sourceUrl: "https://www.scworld.com/brief/baker-tilly-data-breach-exposes-client-information"
cover: "https://covers.duarte.top/covers/20261116-baker-tilly-incidente.jpg"
tipo: incidente
tags: ["vazamento", "terceiros", "eua"]
pais: us
---

En una línea: el dato salió del proveedor, pero la tarea de saber a quién afectó sigue siendo de Baker Tilly.

## Qué ocurrió
Baker Tilly Advisory Group, firma de contabilidad y consultoría de EE. UU. (ingresos anuales de US$ 6.800 millones), está notificando a clientes y dependientes sobre una filtración descubierta el 6 de septiembre de 2026. Un agente no autorizado accedió a datos guardados en una plataforma operada por un proveedor de servicios externo, cuyo nombre no fue divulgado. Quedaron expuestos el nombre completo, la dirección y el número de Social Security. El registro ante el Fiscal General de Texas indica 10.456 personas solo en ese estado; también hay avisos en California y Carolina del Sur. El total no fue divulgado. La empresa afirma que el incidente ocurrió en el entorno del tercero, no en su red, contrató especialistas, avisó a la policía y ofrece 24 meses de monitoreo a través de Experian. No hay reportes de uso indebido ni reivindicación de un grupo de ransomware. La noticia es de SC Media (12/11), con base en BleepingComputer; el aviso oficial no se releyó para este briefing.

## Por qué importa
Las firmas de contabilidad concentran identificadores fiscales de clientes y de sus dependientes. Cuando esos datos quedan en la plataforma de un tercero, el incidente ocurre fuera del perímetro, pero la obligación de notificar y de dimensionar el alcance sigue siendo de quien recolectó el dato.

## Lectura de riesgo
| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Plataforma de tercero | Acceso no autorizado en el entorno del proveedor | Alta |
| Identificador fiscal (SSN) | Nombre, dirección y SSN expuestos, incluso de dependientes | Alta |
| Alcance indefinido | Total no divulgado; notificaciones por estado | Media |

## Qué hacer esta semana
1. Listar los proveedores que almacenan datos personales de clientes y qué campos recibe cada uno — responsable: privacidad/DPO.
2. Confirmar en el contrato el plazo de aviso de incidentes y el derecho a obtener la lista de registros afectados — responsable: jurídico y compras.
3. Señal de que funcionó: para cualquier proveedor, responder en horas cuántos titulares y qué campos están en su entorno.
