---
title: "DreamHost: File Manager flaw exposed FTP credentials for weeks"
description: "FTP and SFTP credentials were exposed from August to October 23, and the customer inherits the task of discovering what was behind them."
pubDate: 2026-11-09T10:24:00-03:00
sourceName: "BleepingComputer"
sourceUrl: "https://www.bleepingcomputer.com/news/security/dreamhost-confirms-data-breach-exposed-ftp-logins-and-webmail-sessions/"
cover: "https://covers.duarte.top/covers/20261104-dreamhost-incidente.jpg"
tipo: incidente
pais: us
tags: ["vazamento", "credenciais", "terceiros", "hospedagem", "eua"]
notionUrl: "https://www.notion.so/40e17411747381efb7ccca9c3f543346"
---

In one line: changing the password ends access, but does not answer what left during the window.

## What happened
On November 4, 2026, BleepingComputer reported that DreamHost confirmed a breach in File Manager, its web file manager. An attacker exploited a flaw in the software and obtained FTP/SFTP usernames and passwords of those who logged into the tool between approximately August 2026 and October 23. Webmail session information, including credentials, may have been exposed for a limited number of users. DreamHost terminated active sessions, invalidated passwords, and took File Manager servers offline. The company did not tell the outlet how many accounts were affected.

## Why it matters
An FTP credential gives read and write access to the customer's site: code, configuration files with database passwords, backups, and forgotten exports on the server. The recommendation to review files for alterations assumes the customer knows what was stored there, which rarely happens.

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| Theft of FTP/SFTP credentials | Confirmed by DreamHost (BleepingComputer) | High |
| Exposure of webmail sessions | Possible, for a limited number of users | Medium |
| Tampering or exfiltration of site files | Not confirmed; depends on each customer | To be confirmed |

## What to do this week
1. Inventory files hosted with external providers, with attention to backups, exports, and configuration files with secrets — owner: web applications team.
2. Review webmail forwarding rules and filters and rotate secrets found in configuration files — owner: IT and security.
3. Signal that it worked: for each third-party credential, there is a list of the personal data and secrets accessible by it.