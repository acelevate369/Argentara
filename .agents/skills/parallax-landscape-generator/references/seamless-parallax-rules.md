# Seamless Parallax Rules

This document dictates the S3-Level implementation for infinite scrolling backgrounds in Argentara.

## 🔴 CRITICAL: The Visual Hierarchy Rule

In a 16-bit game, if the background uses the exact same vibrant colors and contrast as the foreground, the game becomes unplayable visually.
**S3-Level Directive:** You must artificially darken, desaturate, or apply a single color tint (like atmospheric perspective) to all background layers.
If using Canvas, you can achieve this without editing the image file by rendering a semi-transparent dark rectangle over the background layer before drawing the foreground.

## The Seamless Loop Implementation (Vanilla JS)

To make an image loop infinitely without breaking, you must draw it twice side-by-side. You calculate the `scrollX` based on the camera position multiplied by a parallax factor.

```javascript
// S3-Level Infinite Parallax Logic
function drawParallaxLayer(ctx, image, cameraX, parallaxFactor, canvasWidth, yOffset) {
    // 1. Calculate how much the layer has moved
    let moveX = cameraX * parallaxFactor;
    
    // 2. Wrap the movement so it never exceeds the image width
    // This uses the modulo operator to loop the position perfectly
    let offsetX = moveX % image.width;
    
    // In JavaScript, modulo with negative numbers keeps the sign. 
    // We want a positive offset wrapping.
    if (offsetX < 0) {
        offsetX += image.width;
    }

    // 3. Draw the image (moving left as camera moves right)
    ctx.drawImage(image, Math.floor(-offsetX), yOffset);

    // 4. Draw the identical image right next to it to fill the gap
    // If offsetX > 0, the first image leaves a gap on the right.
    ctx.drawImage(image, Math.floor(-offsetX + image.width), yOffset);
    
    // Optional: If the screen is wider than the image, draw a third time
    if (canvasWidth > image.width) {
        ctx.drawImage(image, Math.floor(-offsetX + (image.width * 2)), yOffset);
    }
}
```

## Programmatic Edge Mirroring (No-Seam Hack)

If an AI-generated image is NOT perfectly seamless on the edges, an S3 Engineer fixes it programmatically by drawing the image, and then drawing a flipped/mirrored version of it next to itself, doubling the width but guaranteeing a 100% perfect seam.

```javascript
// Mirroring an image on an offscreen canvas to make it perfectly seamless
function createSeamlessTexture(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width * 2;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    
    // Draw original image on the left
    ctx.drawImage(img, 0, 0);
    
    // Draw horizontally flipped image on the right
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0);
    
    return canvas; // Returns a perfectly seamless canvas element ready for the parallax loop
}
```
