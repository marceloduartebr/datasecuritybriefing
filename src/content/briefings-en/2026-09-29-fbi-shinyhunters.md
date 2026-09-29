---
title: "FBI: ShinyHunters claims breach via Oracle PeopleSoft; FBI investigates without confirming"
description: "The group claims it stole data from nearly all agents and applicants via the FBIJobs.gov portal; the FBI confirms the investigation but says the point of entry — third party or its own environment — has not yet been determined."
pubDate: 2026-09-29T10:12:00-03:00
sourceName: "Cybersecurity Dive"
sourceUrl: "https://www.cybersecuritydive.com/news/fbi-hack-shinyhunters-jobs-portal/831175/"
cover: "https://covers.duarte.top/covers/20260925-fbi-shinyhunters.jpg"
tipo: incidente
tags: ["incident", "claim", "third-party-risk", "oracle-peoplesoft", "united-states"]
notionUrl: "https://www.notion.so/3e6174117473812491f1c2c1a23d4361"
---

In one line: ShinyHunters claims it breached the FBI jobs portal via an Oracle PeopleSoft flaw and stole agent and applicant data; the FBI is investigating but has not confirmed the breach or determined whether the origin was a third party or its own environment.

## What happened

Confirmed by the FBI. In a Wednesday note (23/09/2026), the FBI said it was aware of a cybercriminal group claiming to have compromised the FBIJobs.gov portal, with alleged impact on employees' personal data (PII). According to the agency, the point of entry has not yet been determined — whether at a third party or in the FBI environment — and the investigation is being conducted with the vendors that support the portal to mitigate risk. The portal is offline, with an unavailability notice.

Claimed by ShinyHunters, without FBI confirmation. On its leak site, the group claimed "highly sensitive data from nearly ALL FBI agents" and from job applicants, and listed services it says it hit: Criminal Justice (CJ), HR, Medlink and others. To 404 Media, the group said it entered the portal via a zero-day in Oracle PeopleSoft, an HR platform. ShinyHunters says the attack was retaliation for descriptions the FBI made in a May bulletin and demanded the agency correct or remove the passages.

Partial third-party verification. 404 Media confirmed that a sample provided by the group included sensitive personal information of agents. It is unclear whether the exploited flaw is a zero-day or a vulnerability already disclosed, such as the one Oracle revealed in June after ShinyHunters exploited it. Oracle did not respond to a request for comment.

## Why it matters

Even without confirmation, the case exposes a real point: the FBI itself admits it still does not know whether the origin was a vendor or the internal environment. HR and recruitment portals are often operated by third parties and concentrate high-value personal data, making them de facto perimeter.

The second point is uncertainty about the flaw. If it is the vulnerability disclosed in June, the lesson is patch management, not zero-day. Cynthia Kaiser, a former FBI cybersecurity official, warns of the risk of use by foreign actors and physical harm to agents, and notes that a list from a 2016 leak still circulates on the dark web.

## Risk reading

| Dimension | Assessment |
|---|---|
| Confirmed by the FBI | Open investigation; point of entry (third party or FBI) not determined; portal offline |
| Claimed by the group | Data of nearly all agents and applicants; access to CJ, HR and Medlink; zero-day in Oracle PeopleSoft |
| Independent verification | 404 Media confirmed sensitive agent data in a sample; full scope not verified |
| Initial vector | Uncertain: claimed zero-day or flaw disclosed by Oracle in June |
| Potentially exposed data | Employees' and applicants' personal data, according to the claim |
| Residual risk | High if confirmed: agent data enables harassment, targeting and intelligence collection |

## What to do this week

1. List HR and recruitment portals operated by third parties, with the data each holds, and confirm in contract who delivers logs and how quickly during an incident.
2. Inventory internet-exposed Oracle PeopleSoft instances and confirm application of Oracle's disclosed fixes, including the June one.
3. Signal that it worked: faced with a leak claim, you can say in hours, not days, whether the origin is a vendor or your own environment.
