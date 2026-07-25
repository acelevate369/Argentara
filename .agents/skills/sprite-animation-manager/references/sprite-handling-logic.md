# Sprite Handling Logic

This document details how to build the S3-Level Sprite Animator for Argentara.

## 🔴 CRITICAL: Delta-Time (dt) Animation

Do not advance animation frames by just counting `frames++` on every loop iteration. Monitor refresh rates differ (60Hz vs 144Hz).

**S3-Level Animation Logic:**
```javascript
class SpriteAnimator {
    constructor(frames, frameDurationMs) {
        this.frames = frames; // Can be an array of Image objects OR array of cropping coordinates
        this.frameDuration = frameDurationMs;
        this.currentFrame = 0;
        this.timer = 0;
        this.isSheet = typeof frames[0] === 'object' && frames[0].x !== undefined; 
        this.sheetImage = null; // Only used if isSheet is true
    }

    update(dt) {
        this.timer += dt;
        if (this.timer >= this.frameDuration) {
            this.timer -= this.frameDuration; // Keep remainder for strict accuracy
            this.currentFrame = (this.currentFrame + 1) % this.frames.length;
        }
    }

    render(ctx, x, y, width, height) {
        if (this.isSheet) {
            // SPRITE SHEET LOGIC (9 arguments)
            const crop = this.frames[this.currentFrame];
            ctx.drawImage(
                this.sheetImage, 
                crop.x, crop.y, crop.w, crop.h, // Source Crop
                x, y, width, height             // Destination Canvas
            );
        } else {
            // IMAGE SEQUENCE LOGIC (5 arguments)
            const img = this.frames[this.currentFrame];
            ctx.drawImage(img, x, y, width, height);
        }
    }
}
```

## Handling Image Sequences
If the user provides `player_run_1.png` through `player_run_4.png`:
1. The `AssetManager` preloads all 4 images.
2. The `SpriteAnimator` receives an array of these 4 preloaded `Image` objects.
3. The `render` method simply draws `this.frames[this.currentFrame]`.

## Handling Sprite Sheets
If the user provides `player_run_sheet.png` (64x16, containing 4 frames of 16x16):
1. The `AssetManager` preloads the single image.
2. The `SpriteAnimator` receives the image, and an array of objects: 
   `[{x:0, y:0, w:16, h:16}, {x:16, y:0, w:16, h:16}, ...]`
3. The `render` method uses the 9-parameter `ctx.drawImage` to crop the sheet dynamically.

## Flipping Sprites (Left/Right)
Do not create duplicate sprite sheets for facing left and right.
To flip a sprite horizontally when the player turns left:
```javascript
ctx.save();
ctx.translate(x + width / 2, y + height / 2); // Move origin to center of sprite
ctx.scale(-1, 1); // Flip horizontally
// Draw the sprite at offset -width/2, -height/2
this.animator.render(ctx, -width / 2, -height / 2, width, height);
ctx.restore();
```
