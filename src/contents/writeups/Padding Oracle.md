---
title: Oracle Machine
author: ssanjua
datetime: 2024-09-28T16:55:12.000+00:00
slug: Oracle Machine - Vulnhub
featured: true
tags:
  - Vulnhub
  - Padding Oracle
  - Easy
description:
  This VM, provided by Pentester Lab, has a website vulnerable to padding oracle attack. Our goal is to exploit this vulnerability and login as admin.
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
## Initialization of the machine

Download the .iso from the Vulnhub website: [Pading Oracle](https://www.vulnhub.com/entry/pentester-lab-padding-oracle,174)
Then we initialize the .iso with VMware Workstation Pro 17 and configure the Network Adapter to **bridge** so that our Kali Linux Virtual Machine is on the same network and we can connect. 

![Descripción](../../assets/img-content/paddingOracle(0).png)

## Recognition

After turning on the victim machine and our Kali, we try to recognize the IP of our target with arp-scan.

```bash
sudo arp-scan -I eth0 --localnet --ignoredups
```

![Descripción](../../assets/img-content/paddingOracle(1).png)

Here we see that our target's ip is ``192.168.0.28.
With our target identified we check if it is on and operative with ``ping``.

![Descripción](../../assets/img-content/paddingOracle(2).png)

We see in the output that the victim machine is on and that we are in front of a **Linux** system since the ttl is 64, corresponding to Linux operating systems.

Now we do a scan with nmap to see what services the victim machine is running.

```bash
nmap -p- --open -sSV -n -Pn 192.168.0.28
```

![Descripción](../../assets/img-content/paddingOracle(3).png)

We identify port 80 open and running an **Apache** service so we open the browser to see what kind of web it has mounted.

`http://192.168.0.28`

![Descripción](../../assets/img-content/paddingOracle(4).png)

We see that there is a Register so we create a user.

![Descripción](../../assets/img-content/paddingOracle(12).png)

![Descripción](../../assets/img-content/paddingOracle(5).png)

We capture the cookie that we obtained with our user:

![Descripción](../../assets/img-content/paddingOracle(6).png)

We know that the vulnerability we are trying to exploit is **Padding Oracle** so we will rely on a Perl script ([[padbuster]]) that can be found here: [GitHub repo](https://github.com/AonCyberLabs/PadBuster)

```bash
padBuster.pl http://192.168.0.28/index.php <COOKIE> 8 -cookies 'auth=<COOKIE>'
```

![Descripción](../../assets/img-content/paddingOracle(7).png)

- `http://192.168.200.132/index.php` : web link.
- `CBQwdiyx3jioH63e0Fu2PW0nvw2VJx8G`: cookie.
- 8`: block size must be multiples of 8.    
- `-cookies 'auth=CBQwdiyx3jioH63e0Fu2PW0nvw2VJx8G`: specify encryption type: _auth_ cookie.

![Descripción](../../assets/img-content/paddingOracle(8).png)

As we can see the script decrypts the cookie and appears in plain text **user=ssanjua**.
What we want is to be able to authenticate as the admin user, so if we reverse engineer and encrypt **user=admin**? 

```bash
padBuster.pl http://192.168.0.28/index.php <COOKIE> 8 -cookies 'auth=<COOKIE> -plaintext 'user=admin'
```

![Descripción](../../assets/img-content/paddingOracle(9).png)

![Descripción](../../assets/img-content/paddingOracle(10).png)

Now we have the value **user=admin** encrypted taking advantage of the way **padding** encrypts and decrypts the data.

If we change in value the 'browser' => 'storage' => 'value' so [[padbuster]] generated us:

![Descripción](../../assets/img-content/paddingOracle(11).png)

We managed to authenticate as admin.

---
### + Vulnerability Information

A **Padding Oracle Attack** is a type of attack against encrypted data that allows an attacker to **decrypt** the contents of the data **without knowing the key**.

An oracle refers to a “hint” that provides an attacker with information about whether or not the action he is performing is correct. Imagine you are playing a board or card game with a child: his face lights up with a big smile when he thinks he is about to make a good move. That's an oracle. In your case, as an opponent, you can use this oracle to plan your next move accordingly.

Stuffing is a specific cryptographic term. Some ciphers, which are the algorithms used to encrypt data, work on **blocks of data** in which each block has a fixed size. If the data you want to encrypt is not the right size to fill the blocks, the data is automatically **filled** until it is. Many forms of padding require padding to always be present, even if the original input was the correct size. This allows the padding to always be safely removed after decryption.

By combining the two elements, a software implementation with a padding oracle reveals whether the decrypted data has a valid padding. The oracle could be something as simple as returning a value that says “Invalid padding”, or something more complicated such as taking a considerably different time to process a valid block instead of an invalid one.

Block-based ciphers have another property, called “**mode**”, which determines the relationship of the data in the first block to the data in the second block, and so on. One of the most commonly used modes is **CBC**. CBC presents an initial random block, known as “**initialization vector**” (**IV**), and combines the previous block with the static encryption result so that encrypting the same message with the same key does not always generate the same encrypted output.

An attacker can use a padding oracle, in combination with the CBC way of structuring the data, to send slightly modified messages to the code exposing the oracle and keep sending data until the oracle indicates that they are correct. From this response, the attacker can decrypt the message byte by byte.

Modern computer networks are of such high quality that an attacker can detect very small differences (less than 0.1 ms) in execution time on remote systems. Applications that assume that correct decryption can only occur when data is not altered may be vulnerable to attacks from tools that are designed to observe differences in correct and incorrect decryption. While this timing difference may be more significant in some languages or libraries than others, it is now believed to be a practical threat to all languages and libraries when the application's response to the error is taken into account.

This type of attack relies on the ability to change the encrypted data and test the result against the oracle. The only way to completely mitigate the attack is to detect changes to the encrypted data and refuse to perform actions on it. The standard way to do this is to create a signature for the data and validate it before performing any operation. The signature must be verifiable and the attacker must not be able to create it; otherwise, he could modify the encrypted data and calculate a new signature based on that changed data.

A common type of suitable signature is known as a “**hash message authentication code with key**” (**HMAC**). An HMAC differs from a checksum in that it requires a secret key, which is known only to the person generating the HMAC and the person validating it. If you do not have this key, you cannot generate a correct HMAC. When you receive the data, you can take the encrypted data, independently calculate the HMAC with the secret key shared by both you and the sender, and then compare the HMAC the sender sends against the one you calculated. This comparison must be of constant time; otherwise, you will have added another detectable oracle, thus allowing a different type of attack.

In summary, to safely use padded CBC block ciphers, you need to combine them with an HMAC (or other data integrity check) that is validated by a time-constant comparison before attempting to decrypt the data. Since all modified messages take the same amount of time to generate a response, the attack is prevented.

The padding oracle attack may seem a bit complex to understand, as it involves a feedback process to guess the encrypted content and modify the padding. However, there are tools such as **PadBuster** that can automate much of the process.

PadBuster is a tool designed to automate the decryption process of **CBC** mode encrypted messages using **PKCS #7** padding. The tool allows attackers to send HTTP requests with **malicious padding** to determine whether the padding is valid or not. In this way, attackers can guess the encrypted content and decrypt the entire message.
