---
title: Bash Basic Commands
author: ssanjua
datetime: 2024-09-28T16:55:12.000+00:00
slug: bash terminal
featured: false
tags:
  - Terminal
  - Bash
  - Cheatsheets
description:
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut purus eget sapien.
---
---

## 1. Basic Commands:

| Command | Description                         |
| ------- | ----------------------------------- |
| `ls`    | List files and directories          |
| `cd`    | Change directory                    |
| `pwd`   | Print working directory             |
| `mkdir` | Create a new directory              |
| `rm`    | Remove files or directories         |
| `cp`    | Copy files or directories           |
| `mv`    | Move or rename files or directories |
| `cat`   | Display file contents               |
| `echo`  | Print text or variables             |
| `grep`  | Search for patterns in files        |
| `chmod` | Change file permissions             |
| `chown` | Change file ownership               |
## 2. Variables:

- Declaring a variable: `variable_name=value`
- Accessing a variable: `$variable_name`

Example:

```bash
name="John"
echo "Hello, $name!"
```

## 3. Conditionals:

- if statement

```bash
if [condition]; them
	# code to execute if condition is true
else
# code to execute if condition is false
fi
```

Example:

````bash
age=18
if [ $age -ge 18 ]; then
 echo "You are an adult."
else
 echo "You are not an adult yet."
fi
````

## 4. Loops

- `for` loops:

```bash
for variable in values; do # code to execute for each value done
```

Example:

```bash
fruits=("apple" "banana" "orange") for fruit in "${fruits[@]}"; do echo "I like $fruit." done
```

## 5. Functions

- Declaring a function

```bash
function_name() {
	#code to execute
}
```

- Calling a function: `function_name`

```bash
greet() {
	echo "hello $1"
}

greet "ss4njua"
```

## 6. Command Line Arguments

- Accessing command line arguments: `$1`, `$2`, ...

```bash
echo "First argument: $1" 
echo "Second argument: $2"
```

## 7. File Redirection

| Description                   | Command               |
| ----------------------------- | --------------------- |
| Redirecting output to a file  | `command > file.txt`  |
| Appending output to a file    | `command >> file.txt` |
| Redirecting input from a file | `command < file.txt`  |
Example:

```bash
echo "Hello, World!" > output.txt
cat input.txt >> output.txt
sort < input.txt > sorted.txt
```

## 8. Pipes

- Sending output of one command as input to another command: `command1 | command2`

```bash
ls -l | grep ".txt"
cat file.txt | wc -l
```

---
made with ©2024 made with ❤️ by [ssanjua](http://www.github.com/ssanjua) © 