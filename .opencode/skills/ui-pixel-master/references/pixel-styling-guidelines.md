# Pixel Styling Guidelines

This document outlines the **S3-Level standards** for rendering 8-bit/16-bit pixel art graphics in Argentara.

## 🔴 CRITICAL: Crisp Pixels Guarantee
Pixel art MUST remain crisp and sharp on all screens, regardless of zoom level or device pixel ratio (Retina displays).

## Canvas Configuration

Whenever initializing a canvas, you MUST disable image smoothing. This is a doctoral-level mandate to prevent anti-aliasing.

```javascript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// CRITICAL for Pixel Art
ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.msImageSmoothingEnabled = false;
```

## CSS Image Rendering

Any DOM element displaying pixel art (including the `<canvas>` element itself, or `<img>` tags for UI) must use the following CSS rules:

```css
.pixel-art {
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    image-rendering: pixelated;
}
```

## Integer Scaling Geometry

When resizing the game to fit the browser window, do NOT simply set `width: 100%`. This causes sub-pixel rendering (blurriness).

**S3-Level Scaling Logic:**
1. Determine the base resolution of the game (e.g., 320x180 or 426x240).
2. Calculate the maximum integer multiplier that fits the window: `scale = Math.floor(window.innerWidth / baseWidth)`.
3. Apply this exact scale. Letterbox (black bars) the remaining space using CSS Flexbox or CSS Grid to keep it centered.

## Micro-Animations in Retro UI

To make the UI feel alive ("dynamic aesthetics") without breaking the pixel rule:
- **Hover States:** Instead of smooth color fades (which break the 16-bit illusion), snap instantly between defined palette colors, or use a 2-frame sprite animation (e.g., a hand cursor pointing).
- **Transformations:** Do not rotate elements by arbitrary degrees (e.g., `rotate(15deg)`) as it distorts the pixel grid. Instead, draw rotated frames if rotation is needed, or stick to translations that are multiples of the current scale factor.
- **Glassmorphism? NO.** The general AI prompt mentioned glassmorphism, but for Argentara, **IGNORE** glassmorphism. This is a pixel-art game. Strict adherence to the 16-bit aesthetic overrides generic modern web design trends. Use 9-slice solid borders instead.
