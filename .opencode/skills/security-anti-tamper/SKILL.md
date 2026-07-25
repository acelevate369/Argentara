---
name: security-anti-tamper
description: Implements memory obfuscation and runtime anti-tamper mechanisms to prevent users from cheating via Browser DevTools (modifying player speed, silver points, warta inventory). Use when establishing global states or handling sensitive variables.
argument-hint: "[action: obfuscate|validate] [project path]"
---

# Security & Anti-Tamper Master

Because Argentara is a Vanilla JS web game, all code runs on the client. Amateur developers leave variables like `window.player.silver = 0;` exposed. A doctoral-level AI Engineer must implement robust obfuscation and validation to maintain the integrity of the gameplay experience.

## S3-Level Client Security Vectors

| Vulnerability | Attack Vector | Mitigation Strategy |
| ------------- | ------------- | ------------------- |
| **DevTools Console** | `Player.silver += 9999` | Encapsulate game logic inside an IIFE (Immediately Invoked Function Expression) or ES Modules so variables are not attached to `window`. |
| **Memory Scanning** | Cheat Engine searching for exact HP values | Obfuscate active values (e.g., store `HP ^ salt` instead of `HP`). |
| **Speed Hacking** | Overriding `performance.now()` | Validate `dt` against an independent server timestamp or flag abnormally high `dt` as cheating and pause game. |

## Process

1. **Read `references/memory-obfuscation.md`**.
2. **Scope Lockdown**: Ensure no critical game classes (like `Player`, `Inventory`, or `Subo`) are globally accessible.
3. **Property Freezing**: For configuration files (Level layouts, Quiz answers, Hitbox sizes), use `Object.freeze()` to prevent runtime injection.
4. **Value Shadowing**: For critical stats like `playerHP`, maintain a shadowed, encrypted version. If the raw value diverges from the shadowed value without a legitimate `takeDamage` call, trigger a Game Over penalty.
5. **Validation Check**: Open DevTools mentally. Can you change the player's position from the console? If yes, the security has failed.

## Game Integrity Rules

Never trust the client, even in a single-player game. While we cannot prevent 100% of hacking, we must make it prohibitively difficult for 99% of players.

## References

- [Memory Obfuscation](references/memory-obfuscation.md)
