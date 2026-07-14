---
name: ui-pixel-master
description: Implements and strictly enforces pixel-perfect 8-bit/16-bit UI design, responsive scaling, and micro-animations for the Argentara project without breaking the retro aesthetic. Use when building UI layers, dialogues, menus, or canvas rendering configurations.
argument-hint: "[component name] [project path]"
---

# UI Pixel Master (S3-Level Rendering)

Argentara features an 8-bit/16-bit pixel art style (similar to classic NES/SNES or Terraria). The UI must feel premium, responsive, and "alive" through micro-animations while strictly maintaining the pixelated aesthetic.

## Rendering Layers

| Layer | Type | Responsibility |
| ----- | ---- | -------------- |
| **Canvas Layer** | `<canvas>` | Renders the game world (Player, Warta, Silver, Subo, Terrain, Traps). |
| **UI/HUD Layer** | DOM / HTML | Renders health, silver count, warta info, pause menu, and dialogue boxes. |

## Process

1. **Read `references/pixel-styling-guidelines.md`** before writing CSS/Canvas logic.
2. **Context Configuration**: Ensure Canvas 2D context uses `imageSmoothingEnabled = false`.
3. **Responsive Scaling**: 
   - Calculate integer scaling factors (e.g., 2x, 3x, 4x) for the canvas to avoid pixel blurring on high-DPI displays.
   - Do NOT use floating-point scaling for pixel art.
4. **Implement UI Element**: Create the requested DOM or Canvas element using pure Vanilla JS.
5. **Run UI Validation**:
   - [ ] No blurred pixels (image-rendering is crisp).
   - [ ] Text uses a pixel font (e.g., 'Press Start 2P' or similar local font).
   - [ ] UI micro-animations (hover effects, dialogue typing) are smooth but respect the retro grid.

## Dialogue System (Cak Sura & Cak Baya)

When rendering NPC dialogues or Quiz prompts:
- Implement a "typewriter" effect (letters appearing sequentially).
- Play a short, low-bit 'blip' sound for every character rendered.
- UI boxes must have a clear 9-slice scaled border typical of 16-bit RPGs.

## References

- [Pixel Styling Guidelines](references/pixel-styling-guidelines.md)
