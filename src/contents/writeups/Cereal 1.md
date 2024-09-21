---
title: Cereal 1
author: ssanjua
datetime: 2024-09-04T16:55:12.000+00:00
slug: Cereal 1 - Vulnhub
featured: true
tags:
  - Vulnhub
  - Hacker
  - Easy
  - PHP
description:
 Cereal is a machine that has a vulnerability of insecure deserialization in PHP. Also, we must enumerate the machine properly. Otherwise, we might not even get the foothold
---


### About Release

[Back to the Top](https://www.vulnhub.com/entry/cereal-1,703/#top)

- **Name**: Cereal: 1
- **Date release**: 29 May 2021
- **Author**: [Thomas Williams](https://www.vulnhub.com/author/thomas-williams,695/)
- **Series**: [Cereal](https://www.vulnhub.com/series/cereal,476/)
- **Web page**: [https://www.bootlesshacker.com/cereal-ctf/](https://www.bootlesshacker.com/cereal-ctf/)

gobuster vhost -u http://cereal.ctf:44441/ -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt -t 20 --append-domain

Firstly, let’s scan our local network to find the device:

```nmap -sP 192.168.178.0/24```

Once you find the relevant IP, let’s continue to scan the box itself.


![nmap](https://www.bootlesshacker.com/wp-content/uploads/2021/06/Cereal-Ports.png)

nmap -p- 192.168.178.163
