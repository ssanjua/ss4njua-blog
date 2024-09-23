---
title: My Expenses 1
author: ssanjua
datetime: 2024-09-20T16:55:12.000+00:00
slug: My Expenses 1 - Vulnhub
featured: true
tags:
  - Vulnhub
  - Hacking web
  - Medium
description:
  MyExpense is a deliberately vulnerable web application that allows you to train in detecting and exploiting different web vulnerabilities. MyExpense contains a set of vulnerabilities you need to exploit to achieve the whole scenario.
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
## Recognition

First we try to recognize the IP of our target with arp-scan.

```bash
sudo arp-scan -I eth0 --localnet --ignoredups
```

![Descripción](../../assets/img-content/myExpense(29).png)

Here we see that our target's ip is ``192.168.0.24``.
With our target identified we check if it is on and operational.

```bash
ping <IP_VICTIMA>
```

We can see in the output that the victim machine is on and that we are dealing with a **Linux** system since the ttl is 64, corresponding to Linux operating systems.

![myExpense](../../assets/img-content/myExpense(1).png)

We place the IP in the browser to see what we are dealing with

![myExpense](../../assets/img-content/myExpense(2).png)

Now we do an nmap scan to see what services the victim machine is running.

```bash
nmap -p- --open -sS -vvv -Pn <IP_VICTIMA> -oG allPorts
```

![myExpense](../../assets/img-content/myExpense(3).png)

Port recognition gives us an important piece of information in the `robots.txt` file contained an entry disabling access to `/admin/admin.php`.

The `robots.txt` file usually contains directives that specify paths or files that should not be crawled by robots.

We tried in the browser the path http:<IP_VICTIMA>/admin/admin.php and discovered an administration panel where we see our inactive samuel and the rest of the users of the company.

![myExpense](../../assets/img-content/myExpense(4).png)

Now we have samuel's username and we can login to his account since we have his credentials

![myExpense](../../assets/img-content/myExpense(5).png)

The credentials are correct but the user is disabled so we can't continue that way. 

## Idea

We need to be able to activate Samuel's user, so we need a privileged user to be able to activate it. If we click on the 'Inactive' button we can see the query with which apparently we could change the status to 'Active'.

![myExpense](../../assets/img-content/myExpense(6).png)

Let's try to create a user and see if the site is prone to the **XXS** [[(Cross-Site Scripting)]] vulnerability.

We create a user with a small JavaScript script.

```js
<script>alert("injection")</script>
```

![myExpense](../../assets/img-content/myExpense(8).png)

As we can see in the image above the ``Sign up!'' button is blocked, but by deleting the ``disabled`` instruction through the browser console the button is enabled and we can create the user.

We return to ``http:192.168.0.24/admin/admin.php`` and we verify that we have indeed violated the web. 

### Cookie Hjacking

The next step we try is to try to activate Samuel's account by appropriating the **cookie** of a privileged or managed user. We will try [[Cookie Hijacking]].

We create a small script in **JavaScript** where by listening on port 80 with a **Python** server. The hypothesis is that the administrator user must be running and controlling the service in the ``admin.php`` panel so we can steal the session cookie to be able to activate the Samuel account again. 

![myExpense](../../assets/img-content/myExpense(9).png)

![myExpense](../../assets/img-content/myExpense(10).png)

We change in the browser the current cookie for the one we retrieved in the python server and we will see that one of them is equivalent to the administrator user.

![myExpense](../../assets/img-content/myExpense(11).png)

But unfortunately the simultaneous session of this administrator user is not allowed, so we do not have permissions to see what happens on the page but we can send requests since we are authenticated as the administrator user having stolen his cookie. So we can create or modify the script to make the request we want: that the user slamotte is active.

![myExpense](../../assets/img-content/myExpense(12).png)

We send this new script as XSS again and wait a few seconds and recheck the ``admin/admin.php`` panel with the cookie of a user other than the administrator.

![myExpense](../../assets/img-content/myExpense(13).png)

Now slamotte is active so having his credentials we can log in with his account to try to pass the expenses. 

```bash
user: slamotte
password: fzghn4lw
```

Effectively now we can log in since your account is active and send the expense report. 

![myExpense](../../assets/img-content/myExpense(14).png)

Now we have to validate the expense, the info we get from the chats that can be seen in Samuel's profile indicate that his superior is **Manon Riviere** so we have to get his credential to be able to approve the expense. 

In Samuel's profile you can send messages so if he publishes a message we could try to steal the cookie of the authenticated users. We are going to try this by injecting the JavaScript script to steal the cookie in the body of the message.
Now we check on our Python server if the script returns something interesting.

![myExpense](../../assets/img-content/myExpense(17).png)

We can see several **cookies** probably from all the employees who receive the message. We try to change all of them in the browser until we find the one of our manager.

![myExpense](../../assets/img-content/myExpense(18).png)

Once inside we approve the payment.

![myExpense](../../assets/img-content/myExpense(19).png)

We find that there is one more person who must approve it for it to reach Samuel. 

![myExpense](../../assets/img-content/myExpense(20).png)

His superior Paul Baudoin is in charge of approving financial transactions, so we need to get hold of his credentials now so we can finally approve the expense.

### SQLI

We are going to create a [[SQLI]] (SQL injection) manually. 
First we try to see if the vulnerability exists on the page of the user Manon Riviere.

![myExpense](../../assets/img-content/myExpense(21).png)

We try the following SQL query and it does indeed return interesting information, the database user.

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

