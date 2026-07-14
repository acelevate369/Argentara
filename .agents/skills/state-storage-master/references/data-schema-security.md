# Data Schema & Security

This document specifies how to securely store Argentara's local data to prevent tampering.

## 🔴 CRITICAL: The "Anti-Cheat" S3 Requirement

Web games are notoriously easy to hack. A player can open DevTools and type `localStorage.setItem('argentara_save', '{"silver": 9999}')`. A doctoral-level AI Engineer must implement validation.

## Hashing the Save State

Before saving data to `localStorage`, calculate a simple checksum or hash using a "salt" string.

```javascript
const SALT = "s3cr3t_arg3nt4r4_k3y_992";

function generateHash(dataString) {
    let hash = 0;
    const str = dataString + SALT;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function saveGame(stateObj) {
    const dataString = JSON.stringify(stateObj);
    const hash = generateHash(dataString);
    
    const finalSave = {
        payload: dataString,
        signature: hash
    };
    
    localStorage.setItem('argentara_save', JSON.stringify(finalSave));
}
```

## Schema Validation on Load

When loading, do not blindly trust the parsed object.

1. Re-calculate the hash of `payload`.
2. Compare it to `signature`.
3. If they don't match, `throw new Error('Save file corrupted or tampered');` and trigger a hard reset.
4. Validate types: Ensure `silver` is a `typeof number` and not `NaN` or `Infinity`. Ensure `currentLevel` is exactly `1`, `2`, or `3`.

By enforcing this, you guarantee a 0-error, tamper-proof state management system.
