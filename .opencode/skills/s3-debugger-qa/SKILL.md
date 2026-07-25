---
name: s3-debugger-qa
description: The ultimate Bug Fixer and QA Tester skill. Employs doctoral-level deductive logic to hunt down memory leaks, logic flaws, physics tunneling, and UI rendering glitches. Enforces a 0-bug policy. Use when encountering ANY error, bug, or performance drop.
argument-hint: "[bug description] [project path]"
---

# S3-Level Debugger & QA

A true S3 AI Engineer does not write "AI slop" or use guesswork to fix bugs. They use strict root-cause analysis, isolated testing, and mathematical proofs (for physics/logic) to guarantee a 0-bug environment.

## QA Mindset

| Category | Typical Vanilla JS Issues | S3-Level Resolution |
| -------- | ------------------------- | ------------------- |
| **Physics** | Clipping through walls, double jumps | Check fixed timestep `dt`, AABB sweeping, floor boolean reset. |
| **Memory** | Game slows down after 10 minutes | Hunt unremoved `EventListener`s, ensure Object Pooling is used, avoid `new` in `gameLoop`. |
| **State** | Audio playing twice, UI not clearing | Ensure `exit()` methods on States tear down completely. |
| **Visuals** | Blurry pixels, tearing | Verify integer scaling, `imageSmoothingEnabled = false`, CSS pixelated rules. |

## Process

1. **Read `references/qa-protocols-and-fixes.md`**.
2. **Reproduce & Isolate**: Do not change code yet. Understand EXACTLY how to trigger the bug.
3. **Trace the Call Stack**: Mentally or via `console.trace` follow the execution path. Find the exact file and line where state diverges from intent.
4. **Formulate Hypothesis**: Why did it fail? (e.g., "The collision check ran before gravity was applied").
5. **Implement Surgical Fix**: Change ONLY the necessary lines. Do not rewrite entire functions blindly (no AI hallucinations).
6. **Regression Test**: Ensure the fix didn't break adjacent systems.

## The 0-Bug Guarantee

Before marking a bug as "fixed", verify:
- [ ] Are there any edge cases? (e.g., What if the player hits the jump button exactly on the frame they fall?)
- [ ] Is the fix performant? (Does it add O(N^2) complexity to the game loop?)
- [ ] Is the code clean, readable, and commented?

## References

- [QA Protocols & Fixes](references/qa-protocols-and-fixes.md)
