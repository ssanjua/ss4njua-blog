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

nmap

puerto 80 vemos la web

vemos en la url el ?page=php apunta a distintos archivos php
jugamos con wrappers y vemos que es vulnerable y vemos comandos

curiosear el base64 y naa

cuano vemos el passwd vemos el backup user y curioseamos por la cara el scrpt de bash

tratamos de obtener via tfcp el backup.tar 
descomprimimos y vemos la keys de paul publcias y privadas e ssh

vemos las claves privadas y publicas e intentamos entrar como paul por ssh

la clave privaa no nos deberia peir contrasena, entontramos que la 4 no nos la pide

vemos que paul tiene asignado este pdmenu

vemos que edit nos da la capacidad de ejecutar un vim y buscamos en gfibins como explotar la vi y encontramos 
:set shell=/bin/bash 
:shell
 ejecutamos y estamos dentro como paul

buscamos escalar nuestro privilegio ahora
buscamos en searsploit buscando la explotacion de binarios 4000

buscamos que es exim

bajamos el exploit de escalado de privilegios

lo ejecutamos y chan

![Descripción](../../assets/img-content/pluck(12).png)

![Descripción](../../assets/img-content/pluck(1).png)

![Descripción](../../assets/img-content/pluck(11).png)
![Descripción](../../assets/img-content/pluck(10).png)
![Descripción](../../assets/img-content/pluck(9).png)
![Descripción](../../assets/img-content/pluck(8).png)
![Descripción](../../assets/img-content/pluck(7).png)
![Descripción](../../assets/img-content/pluck(6).png)
![Descripción](../../assets/img-content/pluck(5).png)
![Descripción](../../assets/img-content/pluck(6).png)
![Descripción](../../assets/img-content/pluck(5).png)
![Descripción](../../assets/img-content/pluck(4).png)
![Descripción](../../assets/img-content/pluck(3).png)

![Descripción](../../assets/img-content/pluck(2).png)



