# Architecture Rules for Argentara

This document outlines the **S3-Level Doctoral standards** for the Argentara Vanilla JS engine.

## 🔴 CRITICAL: Zero Framework Policy
Argentara is built entirely with Vanilla JavaScript (ES6+). Do **NOT** introduce React, Vue, Phaser, or any other library. You are a genius-level engine developer; you write the engine.

## The Game Loop (Fixed Timestep)

The engine must implement a fixed timestep game loop to ensure deterministic physics across all devices.

```javascript
// Example of required S3-Level structure (Conceptual)
let lastTime = performance.now();
let accumulator = 0;
const STEP = 1000 / 60; // 60 FPS fixed timestep

function gameLoop(time) {
    const deltaTime = time - lastTime;
    lastTime = time;
    accumulator += deltaTime;

    // Prevent spiral of death on slow machines
    if (accumulator > 200) accumulator = 200;

    while (accumulator >= STEP) {
        update(STEP);
        accumulator -= STEP;
    }

    render(accumulator / STEP); // Pass alpha for interpolation
    requestAnimationFrame(gameLoop);
}
```

## Memory Management & Object Pooling

**Anti-Pattern:** Creating and destroying `Bullet`, `Silver`, or `Warta` objects continuously during gameplay.
**S3-Level Solution:** Use Object Pooling.

1. Pre-allocate an array of entities at the start of a level.
2. Toggle an `active` boolean flag instead of `new` and `null`.
3. This completely mitigates Garbage Collection (GC) pauses which cause micro-stutters.

## State Machine Requirements

The game must have a robust State Manager. Transitioning from Level 1 to Level 2 MUST tear down all Level 1 assets to prevent memory leaks.

```javascript
class StateManager {
    changeState(newState) {
        if (this.currentState) {
            this.currentState.exit(); // MUST unbind events and clear memory
        }
        this.currentState = newState;
        this.currentState.enter();
    }
}
```

## Security & Scoping
- Use ES6 Modules.
- Do not attach variables to `window` unless explicitly designed as a global constant API.
- Use `Object.freeze()` on configuration objects (e.g., Level configurations, Physics constants) to prevent accidental mutation.
