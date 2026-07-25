# Rendering Optimization

This document enforces 60 FPS strict rendering guidelines for Vanilla JS Canvas.

## 🔴 CRITICAL: The Object Creation Rule

You are **FORBIDDEN** from using `new` or literal object creation `{}` inside `update()` or `render()` methods.

**WRONG (Creates garbage every frame):**
```javascript
function getCenter() {
    return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
}
```

**S3-Level RIGHT (Mutates a static object):**
```javascript
// Pre-allocate once
const centerVector = { x: 0, y: 0 }; 

function getCenterOut(outVec) {
    outVec.x = this.x + this.width / 2;
    outVec.y = this.y + this.height / 2;
    return outVec;
}
```

## Offscreen Rendering (Buffering)

If the background (e.g., the Argentara village parallax layer) is complex and static, do NOT redraw 100 tiles every frame.

1. Create a hidden `<canvas>` in memory (OffscreenCanvas).
2. Draw the 100 background tiles to this hidden canvas ONCE during `init()`.
3. In `render()`, simply call `ctx.drawImage(hiddenCanvas, 0, 0)` a single time.

## Fast Math

- Use `Math.trunc(x)` or `x | 0` (bitwise OR) for flooring positive numbers quickly, which is faster than `Math.floor(x)` in some engines, especially when passing coordinates to `drawImage` to prevent anti-aliasing.
- Avoid division in the loop. Multiply by the reciprocal. (e.g., `x * 0.5` instead of `x / 2`).
