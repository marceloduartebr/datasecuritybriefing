---
title: "Cuenta AWS confiable de Qubole se convierte en puerta para secretos y datos de clientes"
description: "Un atacante asumió roles de integración olvidadas durante 12 días y se llevó secretos y buckets enteros de S3."
pubDate: 2026-11-16T10:25:00-03:00
sourceName: "The Register"
sourceUrl: "https://www.theregister.com/security/2026/11/09/attackers-backdoor-trusted-aws-integrations-to-steal-secrets/5308553"
cover: "https://covers.duarte.top/covers/20261110-qubole-incidente.jpg"
tipo: incidente
pais: us
tags: ["terceiros", "aws", "segredos", "identidade-nao-humana", "s3"]
notionUrl: "https://www.notion.so/413174117473816ebb9bee60b47e34b6"
---

En una línea: una relación de confianza entre cuentas que nadie desactivó dio al atacante el mismo alcance que tenía el proveedor.

## Qué ocurrió
Según una investigación publicada el 09/11/2026 por Wiz, con Mandiant, y repercutida por The Register, un actor usó credenciales IAM de una cuenta AWS asociada a Qubole entre el 14 y el 26/10/2026 para asumir los roles de integración creados por clientes. Todas las llamadas AssumeRole tenían External ID y tuvieron éxito; muchos roles ya no estaban en uso, pero la política de confianza seguía activa. El actor enumeró recursos, leyó secretos en variables de entorno de Lambda, Secrets Manager y SSM Parameter Store, validó con TruffleHog claves AWS, secretos de service principals de Entra ID y credenciales OAuth de Okta, y descargó datos de S3, en algunos casos buckets enteros. Hubo una campaña separada del 8 al 11/10 con claves de clientes de la integración. El número de organizaciones afectadas no se divulgó ("múltiples"), no hay atribución, y Qubole y AWS no respondieron a The Register.

## Por qué importa
El acceso de terceros sobrevive al uso real de la integración. Cuando el proveedor es comprometido, el alcance del atacante es el alcance que el rol concedía, incluyendo secretos que abren otros sistemas (Entra ID, Okta).

## Lectura de riesgo
| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Rol cross-account de proveedor | AssumeRole exitoso con External ID | Alta |
| Secretos en Lambda/SSM/Secrets Manager | Lectura y validación de claves | Alta |
| Exfiltración de S3 | Descarga de buckets enteros en algunos casos | Alta |

## Qué hacer esta semana
1. Revisar CloudTrail desde el 01/10 por AssumeRole proveniente de la cuenta 805246085872 — dueño: equipo de cloud security.
2. Eliminar roles de integración sin uso y rotar secretos alcanzables por ellas — dueño: plataforma/IAM.
3. Señal de que funcionó: inventario de roles de terceros con dueño, finalidad y datos alcanzados, sin rol huérfano.

> Nota de indagación: la fuente no fue releída en esta etapa de evaluación; los hechos siguen el registro del radar DSB.
