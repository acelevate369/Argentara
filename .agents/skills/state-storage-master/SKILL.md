---
name: state-storage-master
description: Handles the extreme-precision saving and loading of the Game State (HP, Silver, Warta, Current Level) using LocalStorage or IndexedDB. Incorporates anti-cheat mechanisms. Use when dealing with save data, level transitions, or game overs.
argument-hint: "[action: save|load|reset] [project path]"
---

# State Storage Master (S3-Level Data Integrity)

Argentara requires persistent state across levels, but also strict resetting upon Game Over. This skill ensures data is serialized, stored, and deserialized perfectly, without opening vectors for cheating via the browser's DevTools.

## State Variables

The game state must track:
- `currentLevel` (1, 2, or 3)
- `silverPoints` (Integer)
- `wartaInventory` (Array of collected information IDs)
- `playerHP` (Integer)

## Process

1. **Read `references/data-schema-security.md`**.
2. **Serialization**: Convert the JavaScript state object into a JSON string.
3. **Obfuscation/Hashing**: Append a hash or use base64 encoding to discourage casual tampering. (S3-Level Anti-Cheat).
4. **Storage**: Save to `localStorage.getItem('argentara_save')`.
5. **Deserialization & Validation**:
   - On load, check the hash/signature.
   - If the signature is invalid (tampered), **delete the save file** and force a restart.
   - Parse the JSON and map it strictly to the expected schema.

## Game Over Protocol

When the player dies (e.g., losing to Subo or falling in holes):
1. **Wipe State**: Clear `wartaInventory` and `silverPoints`.
2. **Reset Level**: Set `currentLevel = 1`.
3. **Commit Save**: Overwrite the `localStorage` immediately so they cannot refresh the page to cheat death.

## References

- [Data Schema & Security](references/data-schema-security.md)
