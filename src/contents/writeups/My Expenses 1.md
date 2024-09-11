---
title: My Expenses 1
author: ssanjua
datetime: 2024-09-07T16:55:12.000+00:00
slug: My Expenses 1 - Vulnhub
featured: true
tags:
  - Vulnhub
  - Hacker
  - Easy
  - Hack the box
description:
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien.
---
---
- **Name**: MyExpense: 1
- **Date release**: 7 Dec 2019
- **Author**: [Sh4rpf0rc3](https://www.vulnhub.com/author/sh4rpf0rc3,662/)
- **Series**: [MyExpense](https://www.vulnhub.com/series/myexpense,265/)

## Description

MyExpense is a deliberately vulnerable web application that allows you to train in detecting and exploiting different web vulnerabilities. Unlike a more traditional "challenge" application (which allows you to train on a single specific vulnerability), MyExpense contains a set of vulnerabilities you need to exploit to achieve the whole scenario.

## Scenario

You are "Samuel Lamotte" and you have just been fired by your company "Furtura Business Informatique". Unfortunately because of your hasty departure, you did not have time to validate your expense report for your last business trip, which still amounts to 750 € corresponding to a return flight to your last customer.

Fearing that your former employer may not want to reimburse you for this expense report, you decide to hack into the internal application called **"MyExpense "** to manage employee expense reports.

So you are in your car, in the company carpark and connected to the internal Wi-Fi (the key has still not been changed after your departure). The application is protected by username/password authentication and you hope that the administrator has not yet modified or deleted your access.

Your credentials were: samuel/fzghn4lw

Once the challenge is done, the flag will be displayed on the application while being connected with your (samuel) account.

----
## Reconocimiento

Primero tratamos de reconocer la IP de nuestro objetivo con arp-scan.

```bash
sudo arp-scan -I eth0 --localnet --ignoredups
```

![Descripción](../../assets/img-content/myExpense(29).png)

Acá vemos que nuestro target tiene de ip el  ``192.168.0.24``.
Con nuestro target identificado chequeamos si está encendida y operativa.

```bash
ping <IP_VICTIMA>
```

Vemos en el output que la máquina víctima está encendida y que estamos frente a un sistema **Linux** ya que el ttl es 64, correspondiendo a los sistemas operativos Linux.

![myExpense](../../assets/img-content/myExpense(1).png)

Colocamos la IP en el navegador para ver con que estamos tratando

![myExpense](../../assets/img-content/myExpense(2).png)

Ahora hacemos un escaneo con nmap para ver que servicios está corriendo la máquina víctima.

```bash
nmap -p- --open -sS -vvv -Pn <IP_VICTIMA> -oG allPorts
```

![myExpense](../../assets/img-content/myExpense(3).png)

El reconocimiento de puertos nos da un dato importante en el archivo `robots.txt`  contenía una entrada que deshabilitaba el acceso a `/admin/admin.php`.

El archivo `robots.txt` suele contener directivas que especifican rutas o archivos que no deberían ser rastreados por los robots.

Probamos en el navegador la ruta http:<IP_VICTIMA>/admin/admin.php y descubrimos un panel de administración donde vemos a nuestro samuel inactivo y a el resto de usuarios de la empresa.

![myExpense](../../assets/img-content/myExpense(4).png)

Ahora tenemos el nombre de usuario de samuel y podemos ingresar a su cuenta ya que tenemos sus credenciales

![myExpense](../../assets/img-content/myExpense(5).png)

Las credenciales son correctas pero el usuario está inhabilitado por lo que no podemos continuar ese camino. 

## Idea

Necesitamos poder activar el usuario de Samuel, por lo que necesitamos un usuario privilegiado para poder activarlo. Si hacemos click en el botón de 'Inactivo' podemos ver la query con la que aparentemente se podría cambiar el estado a 'Activo'.

![myExpense](../../assets/img-content/myExpense(6).png)

Vamos a intentar crear un usuario y ver si el sitio es propenso la vulnerabilidad **XXS** [[(Cross-Site Scripting)]]

Creamos un usuario con un pequeno script de JavaScript.

```js
<script>alert("injection")</script>
```

![myExpense](../../assets/img-content/myExpense(8).png)

Como podemos ver en la imagen arriba el botón 'Sign up!' está bloqueado, pero con borrar a través de la consola del navegador la instrucción ``disabled`` el botón queda habilitado y podemos crear el usuario.

Volvemos a ``http:192.168.0.24/admin/admin.php`` y comprobamos que efectivamente hemos vulnerado la web. 

### Cookie Hjacking

El próximo paso que intentamos es intentar activar la cuenta de Samuel apropiándonos de la **cookie** de un usuario privilegiado o administrados. Intentaremos hacer un [[Cookie Hijacking]].

Creamos un pequeño script en **JavaScript** donde mediante ponernos en escucha por el puerto 80 con un servidor de **Python**. La hipótesis es que el usuario administrador debe estar ejecutando y controlando el servicio en el panel ``admin.php`` por lo que podemos robarle la cookie de sesión para poder activar nuevamente la cuenta de Samuel. 

![myExpense](../../assets/img-content/myExpense(9).png)

![myExpense](../../assets/img-content/myExpense(10).png)

Cambiamos en el navegador la cookie actual por la que recuperamos en el servidor python y veremos que una de ella equivale al usuario administrador.

![myExpense](../../assets/img-content/myExpense(11).png)

Pero lamentablemente no se permite la sesión simultanea de este usuario administrador, por lo que no tenemos permisos para ver lo que sucede en la pagina pero si podemos enviar solicitudes ya que estamos autenticados como el usuario administrador al haber robado su cookie. Por lo que podemos crear o modificar el script para que haga la petición que queremos: que el usuario slamotte esté activo.

![myExpense](../../assets/img-content/myExpense(12).png)

Enviamos este nuevo script como XSS nuevamente y esperamos unos segundos y volvemos a chequear el panel ``admin/admin.php`` con la cookie de un usuario que no sea el administrador.

![myExpense](../../assets/img-content/myExpense(13).png)

Ahora slamotte está activo por lo que ya teniendo sus credenciales podemos loguearnos con su cuenta para intentar pasar los gastos. 

```bash
user: slamotte
password: fzghn4lw
```

Efectivamente ahora podemos loguearnos ya que su cuenta está activa y enviamos el reporte de los gastos. 

![myExpense](../../assets/img-content/myExpense(14).png)

Ahora tenemos que validar el gasto, la info que obtenemos de los chats que se pueden ver en el perfil de Samuel indican que su superior es **Manon Riviere** por lo que tenemos que hacernos con su credencial para poder aprobar el gasto. 

En el perfil de Samuel se pueden enviar mensajes por lo que si el publica un mensaje podríamos intentar robarnos la cookie de los usuario que estén autenticados. Vamos a intentarlo inyectando el script de JavaScript para robarnos la cookie en el cuerpo del mensaje.
Ahora chequeamos en nuestro servidor de Python si el script nos devuelve algo interesante.

![myExpense](../../assets/img-content/myExpense(17).png)

Podemos ver varias **cookies** probablemente de todos los empleados que reciben el mensaje. Probamos cambiar en el navegador todas hasta que encontramos la de nuestro manager.

![myExpense](../../assets/img-content/myExpense(18).png)

Una vez dentro aprobamos el pago.

![myExpense](../../assets/img-content/myExpense(19).png)

Nos encontramos con que hay una persona mas que debe aprobarlo para que llegue a Samuel. 

![myExpense](../../assets/img-content/myExpense(20).png)

Su superior Paul Baudoin es el encargado de aprobar las operaciones financieras, por lo que tenemos que hacernos con su credencial ahora para poder aprobar finalmente el gasto.

### SQLI

Vamos a crear una [[SQLI]] (SQL injection) de forma manual. 
Primero intentamos ver si existe la vulnerabilidad en la pagina del usuario Manon Riviere.

![myExpense](../../assets/img-content/myExpense(21).png)

Probamos la siguiente consulta SQL y efectivamente nos devuelve informacion interesante, el usuario de la base de datos.

```sql
192.168.0.24/site.php?id = 2 union select 1,user()--
```

![myExpense](../../assets/img-content/myExpense(22).png)

```sql
192.168.0.24/site.php?id = 2 union select 1,schema_name from information_schema.schemata-- -
```

![myExpense](../../assets/img-content/myExpense(23).png)

![myExpense](../../assets/img-content/myExpense(24).png)

![myExpense](../../assets/img-content/myExpense(25).png)

![myExpense](../../assets/img-content/myExpense(26).png)

![myExpense](../../assets/img-content/myExpense(27).png)

![myExpense](../../assets/img-content/myExpense(28).png)

