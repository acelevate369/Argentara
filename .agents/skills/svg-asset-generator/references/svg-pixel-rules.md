# SVG Pixel Rules & Canvas Integration

This reference dictates how an S3-Level AI should generate SVGs that simulate 16-bit pixel art and load them into a Vanilla JS game engine.

## 🔴 CRITICAL: The Anti-Aliasing Ban

SVGs naturally want to smooth their edges. This ruins pixel art.
Every SVG meant for Argentara must include `shape-rendering="crispEdges"`.

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" shape-rendering="crispEdges">
    <!-- Pixel art goes here -->
</svg>
```

## Creating Pixel Art with SVG Paths

Drawing 256 individual `<rect>` elements for a 16x16 sprite is inefficient for file size.
**S3-Level Method:** Group identical colors into a single `<path>` using horizontal (`h`) and vertical (`v`) relative commands.

**Example: A Silver Block (Simplified 4x4)**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4" shape-rendering="crispEdges">
    <!-- Dark Grey Outline -->
    <path fill="#555555" d="M0,0 h4 v4 h-4 Z M1,1 h2 v2 h-2 Z"/>
    <!-- Silver Fill -->
    <path fill="#C0C0C0" d="M1,1 h2 v2 h-2 Z"/>
    <!-- Shine / Highlight -->
    <path fill="#FFFFFF" d="M1,1 h1 v1 h-1 Z"/>
</svg>
```

## Exporting for Canvas

To use these SVGs in the `core-game-architecture` game loop without flooding the project directory with `.svg` files, you must generate a Data URI wrapper function.

```javascript
// Assets.js
export const Assets = {
    silverCoin: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges">...SVG CODE HERE...</svg>`
};

// Loading it into Canvas
const img = new Image();
img.src = Assets.silverCoin;
// Usage in render loop: ctx.drawImage(img, x, y);
```

*Note: For the utf8 data URI format to work reliably across browsers, characters like `#` in hex codes should ideally be URL-encoded as `%23`. S3 Engineers do not make parsing mistakes.*
