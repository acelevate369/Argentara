# UI/UX Game Principles

This document enforces the S3-Level rules for User Experience in Argentara.

## 🔴 CRITICAL: The "Hit-Stop" and "Screen Shake" Mandate

A platformer without impact feedback feels like a cheap prototype. As an S3 Engineer, you must implement "Game Feel".

**Hit-Stop (Freeze Frame):**
When the player takes damage from a trap, or when they land a hit on the boss (Subo), pause the `gameLoop`'s physics update for exactly 3 to 5 frames (~50ms - 80ms) while keeping the render loop running. This simulates massive impact.

**Screen Shake:**
Apply a diminishing randomized offset to the camera coordinates.
```javascript
// S3-Level Screen Shake
let shakeIntensity = 0;

function applyScreenShake(ctx) {
    if (shakeIntensity > 0) {
        const offsetX = (Math.random() - 0.5) * shakeIntensity;
        const offsetY = (Math.random() - 0.5) * shakeIntensity;
        ctx.translate(offsetX, offsetY);
        shakeIntensity *= 0.9; // Decay
        if (shakeIntensity < 0.5) shakeIntensity = 0;
    }
}
```

## The "Fading HUD" Rule

Players hate blind jumps. If your HUD (Silver count, HP) is fixed at the top left, and the player jumps into the top left corner, the HUD will hide potential traps.

**S3-Level Solution:**
Calculate distance between Player and HUD bounding boxes.
If distance < 50 pixels, apply CSS or Canvas opacity transition: `opacity: 0.3`.

## Quiz UX: The 3-Second Rule

When transitioning from the high-speed platformer to the Quiz (Cak Sura), the player's brain needs a moment to adjust.
- Do not throw text instantly. 
- Use a slide-in or fade-in transition for the dialogue box.
- Dim the background (apply a black semi-transparent overlay) to force the player's focus entirely on the Quiz options.
- The correct/wrong feedback MUST be instantaneous. Never make the player guess if they clicked the button. Use satisfying snap colors (Classic 16-bit Green `#55FF55` and Red `#FF5555`).
