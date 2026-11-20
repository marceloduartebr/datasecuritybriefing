---
title: "Cerca de 40 credit unions de Irlanda afectadas por una filtración en el proveedor Wellington IT"
description: "El ministro Robert Troy confirmó que el proveedor Wellington IT retrasó el aviso de un incidente de octubre que expuso datos de beneficiarios de pagos en cerca de 40 credit unions."
pubDate: 2026-11-20T08:50:00-03:00
sourceName: "RTÉ"
sourceUrl: "https://www.rte.ie/news/2026/1118/1599690-credit-union-data-breach"
cover: "https://covers.duarte.top/covers/20261118-wellington-it-credit-unions-1759.jpg"
tipo: incidente
tags: ["irlanda", "terceiros", "credit-union", "vazamento"]
pais: eu
---

En una línea: el ataque fue en octubre, muchas credit unions solo fueron avisadas ahora, y el dato expuesto es el de a quién pagan los asociados.

## Qué ocurrió

El 18 de noviembre de 2026 RTÉ informó que el ministro de Estado Robert Troy confirmó que Wellington IT, proveedor con sede en Irlanda del Norte, es el tercero involucrado en un incidente de seguridad que afectó a cerca de 40 credit unions, aproximadamente una cuarta parte de las instituciones del país. El ministro dijo que el hecho ocurrió en octubre y que muchas credit unions solo fueron informadas recientemente, lo que calificó de inaceptable; pidió una reunión con la empresa para que explique el retraso. Según RTÉ, Wellington IT procesa datos de cuentas de asociados, y el acceso no autorizado alcanzó información de beneficiarios guardados: nombres, IBAN, BIC, números de cuenta, sort codes, direcciones y referencias de pago. El impacto afecta a quienes usan el servicio en línea. El ministro afirmó que, hasta el momento, no hubo pérdida financiera para las credit unions ni para sus asociados. La Irish League of Credit Unions, que representa a 148 de las cerca de 172 instituciones, dijo entender que la vulnerabilidad fue cerrada y que las cuentas y los saldos no se vieron comprometidos. La Comisión de Protección de Datos de Irlanda dijo a RTÉ haber recibido “numerosas” notificaciones de incidentes y que evalúa el caso con prioridad. El reportaje también habla de un posible impacto en cientos de miles de asociados.

## Por qué importa

El retraso entre el incidente y el aviso a las credit unions es el intervalo en el que el asociado no fue alertado, mientras los datos de beneficiarios ya estaban en manos de un tercero comprometido. Sin un mapa registro por registro, nadie conoce todavía el alcance exacto.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Incidente en un proveedor de TI con acceso a datos de pago | Confirmación del ministro Troy a RTÉ, 18/11 | Alta |
| Exposición de IBAN, BIC y datos de beneficiarios | Reportaje de RTÉ y comunicaciones de las credit unions | Alta |
| Retraso en el aviso a las instituciones | Declaración del ministro de que el retraso no es aceptable | Alta |

## Qué hacer esta semana

1. Listar los proveedores que procesan datos de beneficiarios, IBAN e historial de pagos, con la fecha del último aviso de incidente (responsable: DPO / gestión de proveedores).
2. Exigir evidencia de logs que permitan decir qué registros fueron leídos, no solo la confirmación de que la falla fue cerrada (responsable: CISO).
3. Preparar un aviso a los clientes sobre el riesgo de ingeniería social con datos de beneficiarios, sin asumir que un “saldo intacto” cierra el caso (responsable: atención al cliente / compliance).
