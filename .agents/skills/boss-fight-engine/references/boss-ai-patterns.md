# Boss AI Patterns

This document defines the strict logic rules for programming the Subo Boss Fight in Argentara.

## 🔴 CRITICAL: Loop-Bound Timing

Never use `setTimeout` or `setInterval` for boss attack delays. If the tab loses focus, `requestAnimationFrame` pauses, but `setTimeout` does not, breaking the boss sync.

**S3-Level Timing Logic:**
Use an internal accumulator within the boss class.

```javascript
class SuboAI {
    constructor() {
        this.state = 'IDLE';
        this.timer = 0;
        this.attackCooldown = 2000; // 2 seconds
    }

    update(dt) {
        if (this.state === 'IDLE') {
            this.timer += dt;
            if (this.timer >= this.attackCooldown) {
                this.timer = 0;
                this.executeAttack();
            }
        }
    }
}
```

## Pattern Programming

Boss attacks should be deterministic but feel dynamic. Use an array of patterns or a switch statement based on health thresholds.

### Example Attack: "Ground Slam"
1. **Telegraph (0.0s - 0.5s)**: Subo sprite changes to a "charging jump" frame.
2. **Execution (0.5s - 1.0s)**: Subo moves to the top of the screen (`velocityY = -jumpForce`).
3. **Impact (1.0s)**: Subo moves rapidly down. Upon collision with the ground, a shockwave hitbox is generated expanding on the X-axis.
4. **Recovery (1.0s - 1.5s)**: Subo is vulnerable to player attacks.

## Handling Game Over (Subo Wins)

The user specification mandates a strict penalty:
> "jika Subo menang, maka player akan game over dan point informasi yang didapat akan kereset semua. Sehingga player terpaksa mengulang dari level awal"

**Code Implementation:**
```javascript
function triggerGameOver() {
    GameState.playerHP = GameState.maxHP;
    GameState.wartaInventory = []; // RESET
    GameState.silverPoints = 0; // RESET
    GameState.currentLevel = 1;
    
    // Clear Boss Memory
    SuboManager.destroy();
    
    // Transition to Level 1
    LevelManager.loadLevel(1);
}
```
