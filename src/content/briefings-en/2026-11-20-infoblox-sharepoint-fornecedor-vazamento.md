---
title: "Infoblox confirms a migration vendor accessed SharePoint and took customer and employee data"
description: "The company is investigating unauthorized access, through a migration vendor with SharePoint permissions, to customer configuration snapshots and to employees' financial data and SSNs."
pubDate: 2026-11-20T08:55:00-03:00
sourceName: "The Register"
sourceUrl: "https://www.theregister.com/security/2026/11/16/infoblox-customer-and-staff-data-exposed-in-sharepoint-breach/5310280"
cover: "https://covers.duarte.top/covers/20261118-infoblox-sharepoint-fornecedor-1759.jpg"
tipo: incidente
tags: ["infoblox", "terceiros", "sharepoint", "vazamento"]
pais: us
---

In one line: the snapshot that exists to restore the network also serves to copy it, when a migration vendor already has access to SharePoint.

## What happened

On 16 November 2026 The Register reported, with confirmation from an Infoblox spokesperson, that the company is investigating unauthorized access to company information through a compromised third-party data migration vendor. According to sources for the report, that vendor had trusted access to Infoblox's SharePoint, and the attackers used its accounts to exfiltrate data from there. The customer data included configuration information for some NIOS deployments, including DNS and DHCP snapshots, Grid databases and reporting logs, used to restore the appliance or the grid after a failure. An email from CEO Scott Harrell to staff, seen by The Register, also describes the theft of employee data: financial information such as direct deposit details, contact details, dates of birth and Social Security numbers of employees and their dependents. The company said it activated incident response, hired outside experts and sent notifications. It also said there is no sign that products, cloud services, software updates or build processes were involved. It did not say how many customers and employees were affected. Employees received a 100-dollar password manager stipend and two years of credit monitoring.

## Why it matters

A network recovery copy is, in practice, an exportable inventory of the network. A migration vendor's trusted access turns SharePoint into a shortcut to customer and personal data.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Migration vendor with SharePoint access | Infoblox spokesperson to The Register, 16/11 | High |
| Customer DNS, DHCP and Grid snapshots | Sources for The Register's report | High |
| SSNs, direct deposit and dependents' data | CEO email cited by The Register | Critical |

## What to do this week

1. Map which migration, backup and deployment vendors can reach configuration snapshots or repositories such as SharePoint (owner: CISO / vendor management).
2. Cut those permissions to the minimum and turn on alerts for bulk export or download (owner: data security team).
3. Check whether employee and dependent data (SSNs, payroll, contact details) sit in the same repository as customer snapshots, and separate what does not need to live together (owner: DPO / HR).
