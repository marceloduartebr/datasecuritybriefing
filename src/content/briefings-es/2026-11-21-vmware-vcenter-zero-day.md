---
title: "Zero-day en vCenter: dos meses de acceso de administrador antes del parche"
description: "Una falla explotada desde septiembre da control total de vCenter y pone sobre la mesa la pregunta de qué datos viven en cada VM."
pubDate: 2026-11-21T12:46:00-03:00
sourceName: "BleepingComputer"
sourceUrl: "https://www.bleepingcomputer.com/news/security/vmware-patches-vcenter-zero-day-exploited-in-attacks-since-september/"
cover: "https://covers.duarte.top/covers/20261121-vmware-vcenter-zero-day-0810.jpg"
tipo: vulnerabilidades
tags: ["vmware", "vcenter", "kev", "zero-day", "virtualizacao"]
pais: global
---

**En una línea:** quien controla vCenter alcanza los datos de todas las VM sin pasar por ningún control de la aplicación, y esta falla fue explotada durante más de dos meses antes del parche.

## Qué ocurrió
El 19 de noviembre de 2026, Broadcom publicó el VMSA-2026-0009 con la corrección de la CVE-2026-123890, un bypass de autenticación en el VMware Directory Service de vCenter Server. Con acceso de red y sin credenciales, el atacante obtiene una sesión autenticada como administrator@vsphere.local. VMware, como CNA, asignó un CVSS 3.1 de 9.8 (crítico). Broadcom trata la actualización como de emergencia e informa que no hay workaround oficial.

Mandiant y Google Threat Intelligence Group reportan explotación desde inicios de septiembre de 2026 por un grupo sospechoso de espionaje vinculado a China, rastreado como Armory Castle (antes UNC5221). La cadena comenzó en appliances BeyondTrust Remote Support, pasó por sistemas Linux internos y llegó a vCenter, donde la sesión de administrador permite ejecutar comandos y obtener archivos, incluido el data.mdb del servicio de directorio, según Mandiant. El 20 de noviembre, CISA incluyó la falla en el catálogo KEV, con plazo hasta el 23 de noviembre para las agencias federales.

## Por qué importa
vCenter está por debajo de todas las aplicaciones. Con privilegio de administrador en él, los discos virtuales, snapshots y copias de máquinas quedan accesibles sin tocar el login, el MFA ni los logs de las aplicaciones que guardan datos personales, financieros o de salud. Una intrusión que comenzó en septiembre obliga a responder qué datos había en cada VM del clúster, y no solo si el servidor fue corregido.

## Lectura de riesgo
| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Bypass de autenticación en vCenter (CVE-2026-123890) | Advisory de Broadcom, KEV de CISA el 20/11 | Crítica |
| Explotación como zero-day desde septiembre | Informe de Mandiant y GTIG | Alta |
| Movimiento lateral a partir de acceso remoto (BeyondTrust) | Cadena descrita por Mandiant | Alta |
| Acceso a discos y snapshots de VM con datos regulados | Inferencia a partir del privilegio obtenido | Alta |

## Qué hacer esta semana
1. Aplicar el VMSA-2026-0009 en vCenter y en SDDC Manager, y restringir el acceso de red a vCenter a redes de gestión. Responsable: equipo de infraestructura y virtualización.
2. Cruzar el inventario de VM de ese vCenter con el inventario de datos personales y regulados, para saber qué estaría expuesto si hubo acceso desde septiembre. Responsable: seguridad de datos y privacidad (DPO).
3. Señal de que funcionó: para cada clúster existe una lista de las VM con datos sensibles y la búsqueda de indicadores del informe de Mandiant quedó registrada, con o sin hallazgos.
