---
name: sprite-animation-manager
description: Handles the S3-level logic for rendering and animating 2D sprites. Dynamically supports both Sprite Sheets (one image with multiple frames) and Image Sequences (multiple individual images). Ensures animations are perfectly timed to the game loop.
argument-hint: "[action: animate|load] [project path]"
---

# Sprite Animation Manager (S3-Level Frame Logic)

In Argentara, you will encounter two types of sprite assets provided by the user:
1. **Sprite Sheets**: A single image file containing multiple frames (e.g., a 64x16 image containing four 16x16 frames).
2. **Image Sequences**: Multiple individual files for one animation (e.g., `run1.png`, `run2.png`, `run3.png`).

An S3 AI Engineer must handle BOTH seamlessly without breaking the rendering pipeline or causing memory leaks.

## Responsibilities

1. **Format Agnosticism**: The engine must accept an animation definition regardless of whether it's a sheet or a sequence.
2. **Frame Timing (dt)**: Animations must be driven by the Delta Time (`dt`) of the game loop, NOT by simple frame counts or `setInterval`. If the game slows down, the animation slows down proportionally.
3. **State Switching**: When a player transitions from `IDLE` to `RUN`, the animation frame must reset to 0 immediately to prevent visual glitching.

## Process

1. **Read `references/sprite-handling-logic.md`**.
2. **Determine Asset Type**: Inspect the assets provided by the user. Are they sprite sheets or separate files?
3. **Preloading**: All images must be preloaded into a global `AssetManager` before the level starts. Drawing an image that hasn't finished loading will crash the canvas or cause flickering.
4. **Implementation**: Use the unified `SpriteAnimator` class to handle the rendering.
   - For Sheets: Use the 9-argument version of `ctx.drawImage` to crop the current frame.
   - For Sequences: Swap the source image passed to the 5-argument version of `ctx.drawImage`.

## Cross-Skill Synergy

- **`performance-60fps-master`**: Preload all sequences. Never call `new Image()` inside the `render()` loop.
- **`ui-pixel-master`**: The canvas context must retain `imageSmoothingEnabled = false` when drawing these sprites.

## References

- [Sprite Handling Logic](references/sprite-handling-logic.md)
