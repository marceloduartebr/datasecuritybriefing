---
title: "FBI: ShinyHunters alega invasión vía Oracle PeopleSoft; el FBI investiga sin confirmar"
description: "El grupo dice haber robado datos de casi todos los agentes y candidatos por el portal FBIJobs.gov; el FBI confirma la investigación, pero dice que el punto de invasión, tercero o ambiente propio, aún no se determinó."
pubDate: 2026-09-29T10:12:00-03:00
sourceName: "Cybersecurity Dive"
sourceUrl: "https://www.cybersecuritydive.com/news/fbi-hack-shinyhunters-jobs-portal/831175/"
cover: "https://covers.duarte.top/covers/20260925-fbi-shinyhunters.jpg"
tipo: incidente
tags: ["incidente", "alegacion", "riesgo-de-terceros", "oracle-peoplesoft", "estados-unidos"]
notionUrl: "https://www.notion.so/3e6174117473812491f1c2c1a23d4361"
---

En una línea: ShinyHunters alega haber invadido el portal de vacantes del FBI por una falla en Oracle PeopleSoft y robado datos de agentes y candidatos; el FBI investiga, pero no confirmó la invasión ni determinó si el origen fue un tercero o el propio ambiente.

## Qué ocurrió

Confirmado por el FBI. En nota del miércoles (23/09/2026), el FBI dijo estar al tanto de un grupo ciberdelincuente que alega haber comprometido el portal FBIJobs.gov, con supuesto impacto en datos personales (PII) de empleados. Según la agencia, el punto de invasión aún no se determinó, si en un tercero o en el ambiente del FBI, y la investigación se realiza junto con los proveedores que dan soporte al portal para mitigar el riesgo. El portal está fuera de servicio, con un aviso de indisponibilidad.

Alegado por ShinyHunters, sin confirmación del FBI. En su sitio de filtraciones, el grupo afirmó tener "datos muy sensibles de casi TODOS los agentes del FBI" y de quienes se postularon a una vacante, y listó servicios que dice haber alcanzado: Criminal Justice (CJ), RR.HH., Medlink y otros. A 404 Media, el grupo dijo haber entrado al portal por un zero-day en Oracle PeopleSoft, plataforma de RR.HH. ShinyHunters dice que el ataque fue represalia a las descripciones hechas por el FBI en un boletín de mayo y exigió que la agencia corrija o elimine los tramos.

Verificación parcial por terceros. 404 Media confirmó que una muestra proporcionada por el grupo incluía información personal sensible de agentes. No está claro si la falla explotada es un zero-day o una vulnerabilidad ya divulgada, como la que Oracle reveló en junio después de que ShinyHunters la explotara. Oracle no respondió al pedido de comentario.

## Por qué importa

Aunque sin confirmación, el caso expone un punto real: el propio FBI admite no saber aún si el origen fue un proveedor o el ambiente interno. Portales de RR.HH. y de reclutamiento suelen ser operados por terceros y concentran datos personales de alto valor, lo que los convierte en perímetro de hecho.

El segundo punto es la incertidumbre sobre la falla. Si fuera la vulnerabilidad divulgada en junio, la lección es de gestión de parches, no de zero-day. Cynthia Kaiser, exdirigente de ciberseguridad del FBI, alerta sobre el riesgo de uso por actores extranjeros y de daño físico a agentes, y recuerda que la lista de una filtración de 2016 aún circula en la dark web.

## Lectura de riesgo

| Dimensión | Evaluación |
|---|---|
| Confirmado por el FBI | Investigación abierta; punto de invasión (tercero o FBI) no determinado; portal fuera de servicio |
| Alegado por el grupo | Datos de casi todos los agentes y candidatos; acceso a CJ, RR.HH. y Medlink; zero-day en Oracle PeopleSoft |
| Verificación independiente | 404 Media confirmó datos sensibles de agentes en una muestra; alcance total no verificado |
| Vector inicial | Incierto: zero-day alegado o falla divulgada por Oracle en junio |
| Datos potencialmente expuestos | Datos personales de empleados y candidatos, según la alegación |
| Riesgo residual | Alto, si se confirma: datos de agentes permiten acoso, persecución y recolección de inteligencia |

## Qué hacer esta semana

1. Liste los portales de RR.HH. y reclutamiento operados por terceros, con los datos que cada uno guarda, y confirme en contrato quién entrega logs y en cuánto tiempo durante un incidente.
2. Inventarie las instancias de Oracle PeopleSoft expuestas a internet y confirme la aplicación de las correcciones divulgadas por Oracle, incluida la de junio.
3. Señal de que funcionó: ante una alegación de filtración, usted puede decir en horas, y no en días, si el origen es un proveedor o su propio ambiente.
