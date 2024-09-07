---
title: Cereal 1
author: ssanjua
datetime: 2024-09-28T16:55:12.000+00:00
slug: Cereal 1 - Vulnhub
featured: true
tags:
  - Vulnhub
  - Hacker
  - Medium
description:
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien.
---
---

### About Release

[Back to the Top](https://www.vulnhub.com/entry/cereal-1,703/#top)

- **Name**: Cereal: 1
- **Date release**: 29 May 2021
- **Author**: [Thomas Williams](https://www.vulnhub.com/author/thomas-williams,695/)
- **Series**: [Cereal](https://www.vulnhub.com/series/cereal,476/)
- **Web page**: [https://www.bootlesshacker.com/cereal-ctf/](https://www.bootlesshacker.com/cereal-ctf/)

gobuster vhost -u http://cereal.ctf:44441/ -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -t 20 --append-domain

