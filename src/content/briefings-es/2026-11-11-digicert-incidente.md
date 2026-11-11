---
title: "DigiCert: cuenta sin MFA leyó archivo de clientes durante seis días y la confirmación tardó cuatro meses"
description: "Un sistema interno quedó expuesto a internet desde una migración en 2025; la cuenta se vio en junio, pero el acceso a los datos solo se confirmó en octubre."
pubDate: 2026-11-11T10:24:00-03:00
sourceName: "Mozilla Bugzilla (relatório da DigiCert)"
sourceUrl: "https://bugzilla.mozilla.org/show_bug.cgi?id=2084460"
cover: "https://covers.duarte.top/covers/20261109-digicert-incidente.jpg"
tipo: incidente
pais: us
tags: ["vazamento", "mfa", "documentos-de-identidade", "autoridade-certificadora", "eua"]
notionUrl: "https://www.notion.so/4121741174738115b0aaf1f2c1e15c36"
---

En una línea: DigiCert vio la cuenta indebida en junio y cerró el acceso en julio, pero solo en octubre descubrió que datos de clientes, incluidos documentos de identidad, habían sido leídos.

## Qué ocurrió

En el informe publicado en el Bugzilla de Mozilla (bug 2084460), DigiCert informa que, en una migración de infraestructura el 4 de febrero de 2025, un sistema interno de negocios salió de un segmento restringido por VPN y quedó accesible por internet. Un recurso de autorregistro del gestor de cuentas, pensado para otro uso, permitía crear cuentas que no pasaban por la MFA exigida en los demás accesos y que, por defecto, tenían perfil de solo lectura. Una de esas cuentas accedió a datos archivados entre el 27 de junio y el 2 de julio de 2026.

El equipo notó cuentas externas en junio y liberó la corrección de autorización el 2 de julio, pero trató el caso como creación de cuenta. El 12 de octubre la empresa pasó a sospechar de acceso a los datos y, el 19 de octubre, confirmó el acceso a parte del archivo. Los datos son, en su mayoría, contactos comerciales (nombre, correo, teléfono y dirección); en una pequeña parte de las cuentas, incluyen documentos enviados para validación, como licencia de conducir, pasaporte o factura de servicios. Según DigiCert, la cuenta no podía escribir registros, aprobar validaciones ni emitir certificados, y CA, CertCentral y DigiCert ONE no se vieron afectados. La empresa dice haber contactado a los clientes afectados e informado a la policía, pero no divulgó cuántas personas fueron alcanzadas, incluso después de pedidos de participantes del Bugzilla.

## Por qué importa

El incidente muestra tres intervalos que suelen pasar desapercibidos: el tiempo en que un sistema queda expuesto después de una migración, el tiempo entre ver una cuenta anómala y entender qué leyó, y el tiempo hasta avisar a quien tuvo el documento expuesto. En todos, lo que faltó no fue control de acceso, sino visibilidad sobre el dato guardado en el sistema.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Exposición después de migración | Sistema salió del segmento VPN el 04/02/2025 | Alta |
| Autorregistro sin MFA | Cuentas no atribuidas leían el archivo | Alta |
| Documento de identidad en archivo de negocios | Minoría de las cuentas, sin número divulgado | Alta |
| Demora en el análisis de impacto | Cuenta vista en junio, acceso confirmado el 19/10 | Media |

## Qué hacer esta semana

1. Listar los sistemas movidos de red en los últimos 24 meses y verificar si alguno quedó accesible por internet — responsable: infraestructura.
2. Inventariar dónde quedan copias de documentos de identidad de clientes y definir plazo de retención — responsable: privacidad y gobernanza de datos.
3. Señal de que funcionó: para cualquier cuenta anómala, el equipo logra decir en horas, y no en meses, qué registros podía leer.
