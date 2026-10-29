---
title: "Banco Central registra 99 incidentes cibernéticos en el SFN hasta septiembre"
description: "99 casos hasta septiembre, 73% fraudes; terceros, certificados y APIs en el centro de los eventos."
pubDate: 2026-10-29T10:21:00-03:00
sourceName: "Banco Central"
sourceUrl: "https://www.bcb.gov.br/content/publicacoes/ref/202610/RELESTAB202610-refPub.pdf"
cover: "https://covers.duarte.top/covers/20261029-banco-central-incidentes-sfn.jpg"
tipo: noticia
tags: ["ciberseguranca", "sistema-financeiro", "brasil", "terceiros"]
pais: br
notionUrl: "https://www.notion.so/40817411747381c89bc3ce6cac4333da"
---

**En una línea:** El SFN ya superó el total de 2025 en incidentes cibernéticos, con fraudes dominando y controles de terceros aún incompletos.

## Qué ocurrió

El Informe de Estabilidad Financiera del Banco Central, divulgado el 27 de octubre de 2026, registra 99 incidentes cibernéticos comunicados hasta septiembre, frente a 76 en todo 2025. Las fraudes responden por el 73% de los casos. Criminales usaron acceso a proveedores, certificados digitales no desactivados después de cambio de conexión, contraseñas de cuentas privilegiadas y APIs para generar transacciones con apariencia legítima. En un relevamiento con 1.365 instituciones, solo el 42% evalúa periódicamente el riesgo de cada proveedor.

## Por qué importa

El acceso residual de tercero y la credencial válida siguen siendo más eficaces que un exploit de zero-day. La política de gestión de terceros existe; la evidencia de revocación y de control de API es lo que falta en la mayoría de los entornos.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Tercero / certificado residual | Claves obtenidas en proveedor; certificado no revocado | Alta |
| Credencial privilegiada | Contraseñas de empleados y prestadores vía phishing | Alta |
| API sin autorización | Órdenes de transferencia fuera del flujo normal | Alta |
| Evaluación de proveedor | 42% revisan el riesgo periódicamente | Media |

## Qué hacer esta semana

1. Inventariar certificados y claves de acceso a sistemas de pago y APIs críticas — dueño: operaciones / IAM.
2. Confirmar que todo proveedor con acceso privilegiado tiene evaluación de riesgo actualizada y que las credenciales se revocan el mismo día del cambio — dueño: riesgo de terceros.
3. Señal de que funcionó: informe de certificados activos sin justificación de uso y lista de APIs sin control de autorización en cero o con plan fechado.
