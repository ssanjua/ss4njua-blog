---
title: Pluck 1
author: ssanjua
datetime: 2024-09-21T17:00:12.000+00:00
slug: Pluck - Vulnhub
featured: true
tags:
  - Vulnhub
  - Privilege Scalation
  - Medium
description:
  Pluck is a Boot2Root CTF Challenge and is available at Vulnhub. This challenge is for “Intermediates” and requires some good enumeration and exploitation skills to get root.
---

### About Release

- **Name**: pluck: 1
- **Date release**: 11 Mar 2017
- **Author**: [Ryan Oberto](https://www.vulnhub.com/author/ryan-oberto,474/)
- **Series**: [pluck](https://www.vulnhub.com/series/pluck,109/)


## Recognition

After turning on the victim machine and our Kali, we try to recognize the IP of our target with arp-scan.

```bash
sudo arp-scan -I eth0 --localnet --ignoredups
```

We see in the output that the victim machine is on and that we are in front of a **Linux** system since the ttl is 64, corresponding to Linux operating systems.

Now we do a scan with nmap to see what services the victim machine is running.

```bash
nmap -p- --open -sSV -n -Pn 192.168.128.137
```

![Descripción](../../assets/img-content/pluck(12).png)

Port 80 OPEN, lets check the website:

![Descripción](../../assets/img-content/pluck(1).png)

we see in the url the ?page=php points to different php files
we play with wrappers and we see that it is vulnerable and we see commands

![Descripción](../../assets/img-content/pluck(11).png)
![Descripción](../../assets/img-content/pluck(10).png)

when we see the passwd we see the backup user and look at the bash script

we try to get via tfcp the backup.tar 

![Descripción](../../assets/img-content/pluck(9).png)

we unzip and see the paul public and private keys and ssh

![Descripción](../../assets/img-content/pluck(8).png)

we see the private and public keys and try to login as paul via ssh

the private key should not ask for a password, so we find that 4 does not ask for it.

we see that paul is assigned this pdmenu

![Descripción](../../assets/img-content/pluck(7).png)

we see that edit gives us the ability to run a vim and we look in gfibins for how to exploit the vi and we find 
:set shell=/bin/bash 
:shell
 we execute and we are inside as paul

 ![Descripción](../../assets/img-content/pluck(6).png)

we look for scaling our privilege now
we search in searsploit looking for the 4000 binary exploit

![Descripción](../../assets/img-content/pluck(5).png)
![Descripción](../../assets/img-content/pluck(6).png)

search for exim

we download the privilege escalation exploit

![Description](../../assets/img-content/pluck(3).png)

we execute it and chan

![Descripción](../../assets/img-content/pluck(2).png)