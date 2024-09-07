---
title: Oracle Machine
author: ssanjua
datetime: 2024-09-28T16:55:12.000+00:00
slug: Oracle Machine - Vulnhub
featured: true
tags:
  - Vulnhub
  - Hacker
  - Easy
description:
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien.
---
---

- **Name**: Pentester Lab: Padding Oracle
- **Date release**: 9 Dec 2016
- **Author**: [Pentester Lab](https://www.vulnhub.com/author/pentester-lab,69/)
- **Series**: [Pentester Lab](https://www.vulnhub.com/series/pentester-lab,41/)
- **Lab:** [Vulnhub web](https://www.vulnhub.com/entry/pentester-lab-padding-oracle,174)
- **Web page**: [https://pentesterlab.com/exercises/padding_oracle](https://pentesterlab.com/exercises/padding_oracle)

## Description

This course details the exploitation of a weakness in the authentication of a PHP website. The website uses Cipher Block Chaining (CBC) to encrypt information provided by users and use this information to ensure authentication. The application also leaks if the padding is valid when decrypting the information. We will see how this behaviour can impact the authentication and how it can be exploited.

Source: [https://pentesterlab.com/exercises/padding_oracle/course](https://pentesterlab.com/exercises/padding_oracle/course)

---
## Inicialización de la máquina

Descargamos el .iso de la web de Vulnhub: [Pading Oracle](https://www.vulnhub.com/entry/pentester-lab-padding-oracle,174)
Luego inicializamos el .iso con VMware Workstation Pro 17 y configuramos el Network Adapter a **bridge** para que nuestra Maquina virtual Kali Linux se encuentre en la misma red y podamos conectarnos. 

![Descripción](../assets/img-content/paddingOracle(0).png)
## Reconocimiento

Luego de encender la maquina victima y nuestro Kali, tratamos de reconocer la IP de nuestro objetivo con arp-scan.

```bash
sudo arp-scan -I eth0 --localnet --ignoredups
```

![Descripción](../assets/img-content/paddingOracle(1).png)

Acá vemos que nuestro target tiene de ip el  ``192.168.0.28.
Con nuestro target identificado chequeamos si está encendida y operativa con ``ping``.

![Descripción](../assets/img-content/paddingOracle(2).png)

Vemos en el output que la máquina víctima está encendida y que estamos frente a un sistema **Linux** ya que el ttl es 64, correspondiendo a los sistemas operativos Linux.

Ahora hacemos un escaneo con nmap para ver que servicios está corriendo la máquina víctima.

```bash
nmap -p- --open -sSV -n -Pn 192.168.0.28
```

![Descripción](../assets/img-content/paddingOracle(3).png)

Identificamos el puerto 80 abierto y corriendo un servicio de **Apache** por lo que abrimos el navegador para ver qué tipo de web tiene montada.

`http://192.168.0.28`

![Descripción](../assets/img-content/paddingOracle(4).png)

Vemos que hay un Register así que creamos un usuario.

![Descripción](../assets/img-content/paddingOracle(12).png)

![Descripción](../assets/img-content/paddingOracle(5).png)

Capturamos la cookie que obtuvimos con nuestro usuario:

![Descripción](../assets/img-content/paddingOracle(6).png)

Sabemos que la vulnerabilidad que estamos tratando de explotar es **Padding Oracle** por lo que nos apoyaremos en  un script de Perl ([[padbuster]]) que podemos encontrar aquí:  [GitHub repo](https://github.com/AonCyberLabs/PadBuster)

```bash
padBuster.pl http://192.168.0.28/index.php <COOKIE> 8 -cookies 'auth=<COOKIE>'
```

![Descripción](../assets/img-content/paddingOracle(7).png)

- `http://192.168.200.132/index.php` : web link.
- `CBQwdiyx3jioH63e0Fu2PW0nvw2VJx8G`: cookie.
- `8`: el tamaño del bloque debe ser multiplo de 8    
- `-cookies 'auth=CBQwdiyx3jioH63e0Fu2PW0nvw2VJx8G`: especificamos el tipo de encripting:  _auth_ cookie.

![Descripción](../assets/img-content/paddingOracle(8).png)

Como vemos el script nos desencripta la cookie y aparece en texto plano **user=ssanjua**.
Lo que queremos es poder autenticarnos como el usuario admin, por lo que si hacemos ingeniería inversa y encriptamos **user=admin**? 

```bash
padBuster.pl http://192.168.0.28/index.php <COOKIE> 8 -cookies 'auth=<COOKIE> -plaintext 'user=admin'
```

![Descripción](../assets/img-content/paddingOracle(9).png)

![Descripción](../assets/img-content/paddingOracle(10).png)

Ahora tenemos el valor **user=admin** encriptado aprovechandonos de la forma en la que **padding** encripta y desencripta los datos.

Si cambiamos en valor el 'navegador' => 'storage' => 'value' por lo que [[padbuster]] nos generó:

![Descripción](../assets/img-content/paddingOracle(11).png)

Logramos autenticarnos como admin.

---
### + Información sobre la vulnerabilidad

Un ataque de oráculo de relleno (**Padding Oracle Attack**) es un tipo de ataque contra datos cifrados que permite al atacante **descifrar** el contenido de los datos **sin conocer la clave**.

Un oráculo hace referencia a una “indicación” que brinda a un atacante información sobre si la acción que ejecuta es correcta o no. Imagina que estás jugando a un juego de mesa o de cartas con un niño: la cara se le ilumina con una gran sonrisa cuando cree que está a punto de hacer un buen movimiento. Eso es un oráculo. En tu caso, como oponente, puedes usar este oráculo para planear tu próximo movimiento según corresponda.

El relleno es un término criptográfico específico. Algunos cifrados, que son los algoritmos que se usan para cifrar los datos, funcionan en **bloques de datos** en los que cada bloque tiene un tamaño fijo. Si los datos que deseas cifrar no tienen el tamaño adecuado para rellenar los bloques, los datos se **rellenan** automáticamente hasta que lo hacen. Muchas formas de relleno requieren que este siempre esté presente, incluso si la entrada original tenía el tamaño correcto. Esto permite que el relleno siempre se quite de manera segura tras el descifrado.

Al combinar ambos elementos, una implementación de software con un oráculo de relleno revela si los datos descifrados tienen un relleno válido. El oráculo podría ser algo tan sencillo como devolver un valor que dice “Relleno no válido”, o bien algo más complicado como tomar un tiempo considerablemente diferente para procesar un bloque válido en lugar de uno no válido.

Los cifrados basados en bloques tienen otra propiedad, denominada “**modo**“, que determina la relación de los datos del primer bloque con los datos del segundo bloque, y así sucesivamente. Uno de los modos más usados es **CBC**. CBC presenta un bloque aleatorio inicial, conocido como “**vector de inicialización**” (**IV**), y combina el bloque anterior con el resultado del cifrado estático a fin de que cifrar el mismo mensaje con la misma clave no siempre genere la misma salida cifrada.

Un atacante puede usar un oráculo de relleno, en combinación con la manera de estructurar los datos de CBC, para enviar mensajes ligeramente modificados al código que expone el oráculo y seguir enviando datos hasta que el oráculo indique que son correctos. Desde esta respuesta, el atacante puede descifrar el mensaje byte a byte.

Las redes informáticas modernas son de una calidad tan alta que un atacante puede detectar diferencias muy pequeñas (menos de 0,1 ms) en el tiempo de ejecución en sistemas remotos. Las aplicaciones que suponen que un descifrado correcto solo puede ocurrir cuando no se alteran los datos pueden resultar vulnerables a ataques desde herramientas que están diseñadas para observar diferencias en el descifrado correcto e incorrecto. Si bien esta diferencia de temporalización puede ser más significativa en algunos lenguajes o bibliotecas que en otros, ahora se cree que se trata de una amenaza práctica para todos los lenguajes y las bibliotecas cuando se tiene en cuenta la respuesta de la aplicación ante el error.

Este tipo de ataque se basa en la capacidad de cambiar los datos cifrados y probar el resultado con el oráculo. La única manera de mitigar completamente el ataque es detectar los cambios en los datos cifrados y rechazar que se hagan acciones en ellos. La manera estándar de hacerlo es crear una firma para los datos y validarla antes de realizar cualquier operación. La firma debe ser verificable y el atacante no debe poder crearla; de lo contrario, podría modificar los datos cifrados y calcular una firma nueva en función de esos datos cambiados.

Un tipo común de firma adecuada se conoce como “**código de autenticación de mensajes hash con clave**” (**HMAC**). Un HMAC difiere de una suma de comprobación en que requiere una clave secreta, que solo conoce la persona que genera el HMAC y la persona que la valida. Si no se tiene esta clave, no se puede generar un HMAC correcto. Cuando recibes los datos, puedes tomar los datos cifrados, calcular de manera independiente el HMAC con la clave secreta que compartes tanto tú como el emisor y, luego, comparar el HMAC que este envía respecto del que calculaste. Esta comparación debe ser de tiempo constante; de lo contrario, habrás agregado otro oráculo detectable, permitiendo así un tipo de ataque distinto.

En resumen, para usar de manera segura los cifrados de bloques de CBC rellenados, es necesario combinarlos con un HMAC (u otra comprobación de integridad de datos) que se valide mediante una comparación de tiempo constante antes de intentar descifrar los datos. Dado que todos los mensajes modificados tardan el mismo tiempo en generar una respuesta, el ataque se evita.

El ataque de oráculo de relleno puede parecer un poco complejo de entender, ya que implica un proceso de retroalimentación para adivinar el contenido cifrado y modificar el relleno. Sin embargo, existen herramientas como **PadBuster** que pueden automatizar gran parte del proceso.

PadBuster es una herramienta diseñada para automatizar el proceso de descifrado de mensajes cifrados en modo **CBC** que utilizan relleno **PKCS #7**. La herramienta permite a los atacantes enviar peticiones HTTP con **rellenos maliciosos** para determinar si el relleno es válido o no. De esta forma, los atacantes pueden adivinar el contenido cifrado y descifrar todo el mensaje.
