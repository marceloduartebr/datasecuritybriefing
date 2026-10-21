---
title: "Smart Sampa: credenciales expuestas por 11 meses dieron acceso a 58 mil cámaras en SP"
description: "Repositorio público con logins y contraseñas de Smart Sampa permitió acceso indebido a más de 58 mil cámaras, incluyendo escuelas y hospitales, durante unos 11 meses."
pubDate: 2026-10-21T10:17:00-03:00
sourceName: "Canaltech"
sourceUrl: "https://canaltech.com.br/mercado/falha-no-smart-sampa-expos-acesso-a-58-mil-cameras-de-sp-por-quase-um-ano/"
cover: "https://covers.duarte.top/covers/20261020-smart-sampa-cameras.jpg"
tipo: incidente
tags: ["vazamento", "vigilancia", "brasil", "credenciais", "governanca"]
pais: br
notionUrl: "https://www.notion.so/3ff17411747381ea9422efcda2753045"
---

En una línea: Credenciales de sistema de vigilancia pública quedaron expuestas por 11 meses y permitieron acceso a 58 mil cámaras en São Paulo.

## Qué ocurrió

El 20 de octubre de 2026 UOL reportó que datos confidenciales de Smart Sampa (Prefeitura de São Paulo) estaban en repositorio público desde hace unos 11 meses. Incluían 181 logins/contraseñas, datos de más de 6 mil agentes e instrucciones de acceso. La reportaje accedió a imágenes en vivo de más de 58 mil cámaras en calles, escuelas, guarderías, hospitales y UPAs. La Prefeitura lo atribuyó a un servidor apartado de la GCM, negó falla sistémica, retiró el repositorio y adoptó 2FA. El MP-SP abrió investigación. Contrato de operación de R$ 588 millones con Consorcio Smart City SP / Sentinelx.

## Por qué importa

Credencial filtrada de sistema de monitoreo público es evidencia de ausencia de inventario y de control de acceso en tiempo real. Política y contrato no sustituyen visibilidad sobre quién aún puede entrar en cámaras de lugares sensibles. 2FA posterior no cubre el período de exposición ni los riesgos de inserción de datos falsos en reconocimiento facial señalados por especialistas.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Exposición de credenciales | Repositorio público por ~11 meses con 181 logins | Alta |
| Acceso a cámaras sensibles | Escuelas, guarderías, hospitales, UPAs visualizados | Alta |
| Ausencia de 2FA | Acceso probado sin autenticación en dos pasos | Media |
| Riesgo de datos falsos | Interfaces con posible inserción de registros de reconocimiento facial | Indeterminada |

## Qué hacer esta semana

1. Mapear todos los repositorios, carpetas y tickets con credenciales de sistemas de monitoreo o acceso privilegiado — dueño: Seguridad / TI.
2. Auditar cuentas activas de terceros y servidores con acceso a cámaras o plataformas de vigilancia — dueño: Control de Acceso.
3. Confirmar que sistemas críticos tienen inventario de credenciales con revisión periódica inferior a 90 días y alerta de exposición — señal: informe de cuentas sin uso o con contraseña antigua.
