---
title: "SSHole: bypass de contraseña en OpenSSH en Linux con musl entra en el KEV"
description: "En ciertas configuraciones, cualquier contraseña larga es aceptada; la explotación ya se vio y la CISA incluyó la falla en el KEV."
pubDate: 2026-11-11T18:20:00-03:00
sourceName: "NVD (NIST)"
sourceUrl: "https://nvd.nist.gov/vuln/detail/CVE-2026-123158"
cover: "https://covers.duarte.top/covers/20261110-openssh-sshole-kev.jpg"
tipo: vulnerabilidades
pais: us
tags: ["kev", "openssh", "containers", "alpine", "autenticacao"]
notionUrl: "https://www.notion.so/41317411747381d597ded18fec4f3b22"
---

En una línea: el SSH olvidado en imágenes de contenedor se volvió puerta de entrada con explotación activa.

## Qué ocurrió
La CISA incluyó el 09/11/2026 el CVE-2026-123158 en el catálogo KEV. Según el NVD, el sshd de OpenSSH anterior a 10.6p2, en Linux con musl libc y sin PAM (caso de Alpine Linux), no tiene la protección contra un bypass de autenticación por contraseña: en ciertas configuraciones de cuentas, cualquier contraseña entre 256 y 1.024 caracteres es aceptada. Hay pruebas de concepto públicas y la prensa reportó intentos de explotación en honeypots entre el 05 y el 06/11. Corrección: OpenSSH 10.6p2 y paquetes de Alpine. CVSS 8,1 (CNA MITRE; NVD aún sin nota); EPSS 1,0% el 09/11.

## Por qué importa
Alpine es base común de contenedores. Un sshd activo en una imagen poco revisada puede dar acceso a volúmenes y secretos de producción.

## Lectura de riesgo
| Vector | Evidencia pública | Gravedad |
|---|---|---|
| sshd con contraseña en Alpine/musl sin PAM | KEV 09/11/2026; PoCs públicas | Alta |
| Contenedor con volumen de datos | Depende de la configuración | Media a alta |

## Qué hacer esta semana
1. Actualizar a OpenSSH 10.6p2 o paquete corregido de Alpine — dueño: plataforma/infra.
2. Barrer imágenes y registries por sshd activo y desactivar autenticación por contraseña — dueño: DevSecOps.
3. Señal de que funcionó: cero imágenes Alpine con sshd por contraseña expuesto, y lista de los datos montados en las que mantienen SSH.

> Nota de verificación: la fuente no fue releída en esta etapa de evaluación; los hechos siguen el registro del radar DSB.
