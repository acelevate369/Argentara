# Collision & Physics Rules

This document dictates the S3-Level physical calculations for Argentara's Vanilla JS engine.

## 🔴 CRITICAL: Tunneling Prevention

If the player falls at a velocity of 20 pixels/frame, and a floor is 10 pixels thick, a naive check `if (player.y > floor.y)` will fail if the player skips past it.

**S3-Level Resolution:** Continuous Collision Detection (Sweep) OR Fixed Sub-stepping.

### The Sub-stepping Approach:
Instead of moving the player by `velocity.y` all at once, break it down:

```javascript
function moveAndCollide(entity, mapBounds) {
    // 1. Move X
    entity.x += entity.velocityX;
    let collisionX = checkMapCollision(entity, mapBounds);
    if (collisionX) {
        if (entity.velocityX > 0) {
            entity.x = collisionX.left - entity.width;
        } else {
            entity.x = collisionX.right;
        }
        entity.velocityX = 0;
    }

    // 2. Move Y
    entity.y += entity.velocityY;
    let collisionY = checkMapCollision(entity, mapBounds);
    if (collisionY) {
        if (entity.velocityY > 0) {
            entity.y = collisionY.top - entity.height;
            entity.isGrounded = true; // Safe to jump again
        } else {
            entity.y = collisionY.bottom;
        }
        entity.velocityY = 0;
    } else {
        entity.isGrounded = false;
    }
}
```

## Trap Box Sizing
Never make the trap's damage hitbox exactly the same size as its sprite. 
- S3-Level Game Design dictates "Player Favorability".
- A spike trap hitbox should be slightly smaller (e.g., 2-4 pixels inset on all sides) than the visual pixels so players don't feel "cheated" if they barely brush past it.

## Delta Time (dt) Multipliers
Physics constants (Gravity, Jump Strength, Run Acceleration) MUST be multiplied by `dt` or updated within the fixed timestep loop (as per `architecture-rules.md`).

- Gravity: `entity.velocityY += GRAVITY * dt`
- Jump: `entity.velocityY = -JUMP_FORCE` (Instantly applies, do not multiply by dt for the impulse itself).
