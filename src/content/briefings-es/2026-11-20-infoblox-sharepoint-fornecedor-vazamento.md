---
title: "Infoblox confirma que un proveedor de migración accedió a SharePoint y se llevó datos de clientes y de empleados"
description: "La empresa investiga un acceso no autorizado, a través de un proveedor de migración con permiso en SharePoint, a snapshots de configuración de clientes y a datos financieros y SSN de empleados."
pubDate: 2026-11-20T08:55:00-03:00
sourceName: "The Register"
sourceUrl: "https://www.theregister.com/security/2026/11/16/infoblox-customer-and-staff-data-exposed-in-sharepoint-breach/5310280"
cover: "https://covers.duarte.top/covers/20261118-infoblox-sharepoint-fornecedor-1759.jpg"
tipo: incidente
tags: ["infoblox", "terceiros", "sharepoint", "vazamento"]
pais: us
---

En una línea: el snapshot que existe para recuperar la red también sirve para copiarla, cuando un proveedor de migración ya tiene acceso a SharePoint.

## Qué ocurrió

El 16 de noviembre de 2026 The Register informó, con confirmación de un portavoz de Infoblox, que la empresa investiga un acceso no autorizado a información de la compañía a través de un proveedor externo de migración de datos comprometido. Según fuentes del reportaje, ese proveedor tenía acceso de confianza al SharePoint de Infoblox, y los atacantes usaron sus cuentas para exfiltrar datos desde allí. Entre los datos de clientes había información de configuración de algunas implementaciones de NIOS, incluidos snapshots de DNS, DHCP, bases del Grid y logs de informes, usados para recuperar el appliance o el grid en caso de falla. Un correo del CEO Scott Harrell a los empleados, visto por The Register, describe además el robo de datos de empleados: información financiera como depósito directo, contacto, fecha de nacimiento y números de Social Security de empleados y dependientes. La empresa afirmó haber activado la respuesta a incidentes, contratado especialistas externos y enviado notificaciones. Dijo también que no hay indicios de que estén involucrados productos, servicios en la nube, actualizaciones de software o procesos de build. No informó cuántos clientes y empleados fueron afectados. Los empleados recibieron un bono de 100 dólares para un gestor de contraseñas y dos años de monitoreo de crédito.

## Por qué importa

La copia de recuperación de la red es, en la práctica, un inventario exportable de la red. El acceso de confianza de un proveedor de migración convierte a SharePoint en un atajo hacia datos de clientes y de personas.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Proveedor de migración con acceso a SharePoint | Portavoz de Infoblox a The Register, 16/11 | Alta |
| Snapshots de DNS, DHCP y Grid de clientes | Fuentes del reportaje de The Register | Alta |
| SSN, depósito directo y datos de dependientes | Correo del CEO citado por The Register | Crítica |

## Qué hacer esta semana

1. Mapear qué proveedores de migración, backup e implementación tienen acceso a snapshots de configuración o a repositorios como SharePoint (responsable: CISO / gestión de proveedores).
2. Restringir el alcance de esos accesos al mínimo y activar alertas de exportación o descarga masiva (responsable: equipo de seguridad de datos).
3. Verificar si los datos de empleados y dependientes (SSN, pagos, contacto) están en el mismo repositorio que los snapshots de clientes y separar lo que no necesita convivir (responsable: DPO / RR. HH.).
