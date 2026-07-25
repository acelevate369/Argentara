# Memory Obfuscation & Security

This document details the S3-Level anti-tamper implementations for Argentara.

## 🔴 CRITICAL: The IIFE / Module Mandate

Never write script files that pollute the global namespace.
**Amateur:**
```html
<script src="player.js"></script> <!-- Defines var player = {} -->
```
**S3-Level:**
```html
<script type="module" src="main.js"></script>
```
OR
```javascript
(function() {
    const player = {};
    // Entire game logic here. 
    // DevTools cannot access 'player' from the console.
})();
```

## Obfuscating Active Memory (The XOR Method)

To stop casual memory scanners (like Cheat Engine) from finding the Player's Silver points or HP, do not store them as plain integers.

```javascript
class SecureStat {
    constructor(initialValue) {
        this.salt = Math.floor(Math.random() * 1000000);
        this._set(initialValue);
    }

    _set(val) {
        this.obfuscated = val ^ this.salt;
    }

    get() {
        return this.obfuscated ^ this.salt;
    }

    add(val) {
        let current = this.get();
        this._set(current + val);
    }
}

// Usage
const playerSilver = new SecureStat(0);
playerSilver.add(5);
console.log(playerSilver.get()); // 5
// In memory, it looks like a random large integer, not 5.
```

## State Reconciliation

If you apply damage to the player, you update the `SecureStat`. If you run a periodic check in the game loop and find that the raw UI representation doesn't match the `SecureStat`, someone has altered the UI DOM or memory manually.

React by triggering an immediate `Level Restart` with the message:
> "Anomali terdeteksi. Warta di-reset."
