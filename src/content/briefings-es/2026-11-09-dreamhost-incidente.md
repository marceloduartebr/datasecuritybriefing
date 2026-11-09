---
title: "DreamHost: fallo en File Manager expuso credenciales de FTP durante semanas"
description: "Credenciales de FTP y SFTP estuvieron expuestas de agosto al 23 de octubre, y el cliente hereda la tarea de descubrir qué había detrás de ellas."
pubDate: 2026-11-09T10:24:00-03:00
sourceName: "BleepingComputer"
sourceUrl: "https://www.bleepingcomputer.com/news/security/dreamhost-confirms-data-breach-exposed-ftp-logins-and-webmail-sessions/"
cover: "https://covers.duarte.top/covers/20261104-dreamhost-incidente.jpg"
tipo: incidente
pais: us
tags: ["vazamento", "credenciais", "terceiros", "hospedagem", "eua"]
notionUrl: "https://www.notion.so/40e17411747381efb7ccca9c3f543346"
---

En una línea: cambiar la contraseña cierra el acceso, pero no responde qué salió durante la ventana.

## Qué ocurrió
El 4 de noviembre de 2026, BleepingComputer informó que DreamHost confirmó una violación en File Manager, su gestor de archivos web. Un atacante explotó un fallo en el software y obtuvo usuarios y contraseñas de FTP/SFTP de quienes iniciaron sesión en la herramienta entre aproximadamente agosto de 2026 y el 23 de octubre. Información de sesión de webmail, incluidas credenciales, puede haber sido expuesta para un número limitado de usuarios. DreamHost cerró sesiones activas, invalidó contraseñas y sacó los servidores de File Manager de servicio. La empresa no informó al medio cuántas cuentas fueron afectadas.

## Por qué importa
Una credencial de FTP da acceso de lectura y escritura al sitio del cliente: código, archivos de configuración con contraseñas de base de datos, respaldos y exportaciones olvidadas en el servidor. La recomendación de revisar los archivos en busca de alteraciones supone que el cliente sepa qué estaba almacenado allí, lo que raramente ocurre.

## Lectura de riesgo
| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Robo de credenciales FTP/SFTP | Confirmado por DreamHost (BleepingComputer) | Alta |
| Exposición de sesiones de webmail | Posible, para número limitado de usuarios | Media |
| Adulteración o exfiltración de archivos de sitios | No confirmada; depende de cada cliente | A confirmar |

## Qué hacer esta semana
1. Inventariar los archivos alojados en proveedores externos, con atención a respaldos, exportaciones y archivos de configuración con secretos — responsable: equipo de aplicaciones web.
2. Revisar reglas de reenvío y filtros de webmail y rotar secretos encontrados en archivos de configuración — responsable: TI y seguridad.
3. Señal de que funcionó: para cada credencial de tercero, existe una lista de los datos personales y secretos accesibles por ella.