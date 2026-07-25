---
name: svg-asset-generator
description: Generates high-quality, scalable 2D assets (Silver, Warta, Icons, UI Elements) using inline SVG code. Optimized for pixel-art emulation or crisp vector graphics that fit the 8-bit/16-bit retro aesthetic. Use when the user needs new visual assets without external image files.
argument-hint: "[asset description] [project path]"
---

# SVG Asset Generator (S3-Level Vector Arts)

To keep Argentara lightweight and self-contained, assets can be generated dynamically using SVG (Scalable Vector Graphics). However, because the game has a strict 8-bit/16-bit pixel art style, standard curved SVGs look out of place. This skill enforces techniques to generate pixel-perfect, retro-styled art using SVGs.

## S3-Level SVG Responsibilities

1. **Pixel-Art via SVG Rectangles**: Using `<rect>` on a strict coordinate grid to draw pixel-by-pixel if necessary for small assets (like a 16x16 Silver coin).
2. **Crisp Rendering**: Ensuring `shape-rendering="crispEdges"` is used to prevent anti-aliasing.
3. **Data URI Conversion**: Converting SVG code into base64 `data:image/svg+xml;base64,...` so it can be loaded directly into `<canvas>` via `new Image()`.

## Process

1. **Read `references/svg-pixel-rules.md`**.
2. **Determine Asset Size**: Establish the base grid size (e.g., 16x16, 24x24).
3. **Draft the Grid**: For pixel art, use multiple `<rect>` elements, or a highly optimized `<path>` with strict 90-degree lines (using `M`, `h`, `v`, `Z` commands).
4. **Color Palette Mapping**: Ensure the colors match the game's retro palette (e.g., no gradients, only solid colors and sharp shadows).
5. **Output Delivery**:
   - Provide the raw inline `<svg>` code.
   - Provide the JavaScript string version for Canvas ingestion.

## Cross-Skill Synergy

- Asset SVGs generated here are to be consumed by `ui-pixel-master` for DOM display, or `platformer-mechanics` for Hitbox dimensions.

## References

- [SVG Pixel Rules](references/svg-pixel-rules.md)
