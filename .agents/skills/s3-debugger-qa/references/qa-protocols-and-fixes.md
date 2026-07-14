# QA Protocols & Fixes

This reference dictates the doctoral-level approach to finding and eliminating bugs in Vanilla JS games.

## 🔴 CRITICAL: The "No Console.log Spaghetti" Rule

While `console.log` is useful, leaving hundreds of logs in production code is amateur. Use a structured debug flag.

```javascript
const DEBUG = false;

function log(message) {
    if (DEBUG) console.log(`[Engine] ${message}`);
}
```
Draw hitboxes directly to the canvas when `DEBUG` is true. This is the only acceptable way to debug physics.

## Memory Leak Hunting

**Symptom:** The game runs at 60 FPS initially, but drops to 20 FPS after fighting Subo or retrying Level 1 a few times.

**Root Cause Checklist:**
1. **DOM Event Listeners:** Did you attach `window.addEventListener('keydown')` when Level 1 started, but forgot to `removeEventListener` when it ended? Every retry adds another listener.
2. **Orphaned Intervals/Timeouts:** Did you use `setInterval` for a UI blinking effect and forget `clearInterval`?
3. **Canvas State:** Are you calling `ctx.save()` more times than `ctx.restore()`? This will crash the browser.

## Dealing with AI Hallucinations

As an AI Engineer, you must actively prevent yourself from generating "slop":
- If asked to fix a bug, DO NOT rewrite an entire class. Provide the exact diff.
- Do NOT assume a variable exists without checking the codebase.
- If a method in Vanilla JS doesn't exist (like `Array.prototype.flatMap`), check browser compatibility or write a polyfill. Do not pretend it exists universally if targeting older webviews.
