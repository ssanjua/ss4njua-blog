---
title: Vim shortcuts 
author: ssanjua
datetime: 2024-09-21T16:55:12.000+00:00
slug: Vim shortcuts cheatsheet
featured: false
tags:
  - Linux
  - Cheatsheets
  - Vim
description:
  Vim was the worst when I started, now I love it but I survived because of this cheatsheet.
---
---
### Global

| Command               | Description                                               |
|-----------------------|-----------------------------------------------------------|
| `:h[elp] keyword`     | Open help for keyword                                      |
| `:sav[eas] file`      | Save file as                                              |
| `:clo[se]`            | Close current pane                                        |
| `:ter[minal]`         | Open a terminal window                                    |
| `K`                   | Open man page for word under the cursor                   |

**Tip:** Run `vimtutor` in a terminal to learn the first Vim commands.

### Cursor movement

| Command       | Description                                                           |
| ------------- | --------------------------------------------------------------------- |
| `h`           | Move cursor left                                                      |
| `j`           | Move cursor down                                                      |
| `k`           | Move cursor up                                                        |
| `l`           | Move cursor right                                                     |
| `gj`          | Move cursor down (multi-line text)                                    |
| `gk`          | Move cursor up (multi-line text)                                      |
| `H`           | Move to top of screen                                                 |
| `M`           | Move to middle of screen                                              |
| `L`           | Move to bottom of screen                                              |
| `w`           | Jump forwards to the start of a word                                  |
| `W`           | Jump forwards to the start of a word (words can contain punctuation)  |
| `e`           | Jump forwards to the end of a word                                    |
| `E`           | Jump forwards to the end of a word (words can contain punctuation)    |
| `b`           | Jump backwards to the start of a word                                 |
| `B`           | Jump backwards to the start of a word (words can contain punctuation) |
| `ge`          | Jump backwards to the end of a word                                   |
| `gE`          | Jump backwards to the end of a word (words can contain punctuation)   |
| `%`           | Move cursor to matching character (`()`, `{}`, `[]`)                  |
| `0`           | Jump to the start of the line                                         |
| `^`           | Jump to the first non-blank character of the line                     |
| `$`           | Jump to the end of the line                                           |
| `g_`          | Jump to the last non-blank character of the line                      |
| `gg`          | Go to the first line of the document                                  |
| `G`           | Go to the last line of the document                                   |
| `5gg` or `5G` | Go to line 5                                                          |
| `gd`          | Move to local declaration                                             |
| `gD`          | Move to global declaration                                            |
| `fx`          | Jump to next occurrence of character `x`                              |
| `tx`          | Jump to before next occurrence of character `x`                       |
| `Fx`          | Jump to the previous occurrence of character `x`                      |
| `Tx`          | Jump to after previous occurrence of character `x`                    |
| `;`           | Repeat previous `f`, `t`, `F` or `T` movement                         |
| `,`           | Repeat previous `f`, `t`, `F` or `T` movement, backwards              |
| `}`           | Jump to next paragraph (or function/block when editing code)          |
| `{`           | Jump to previous paragraph (or function/block when editing code)      |
| `zz`          | Center cursor on screen                                               |
| `zt`          | Position cursor on top of the screen                                  |
| `zb`          | Position cursor on bottom of the screen                               |
| `Ctrl + e`    | Move screen down one line (without moving cursor)                     |
| `Ctrl + y`    | Move screen up one line (without moving cursor)                       |
| `Ctrl + b`    | Move screen up one page (cursor to last line)                         |
| `Ctrl + f`    | Move screen down one page (cursor to first line)                      |
| `Ctrl + d`    | Move cursor and screen down 1/2 page                                  |
| `Ctrl + u`    | Move cursor and screen up                                             |
