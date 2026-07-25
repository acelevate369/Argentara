---
name: parallax-landscape-generator
description: Guides the generation and implementation of seamless, elongated 16-bit landscape backgrounds. Ensures background art has low contrast to highlight the main game layer, and implements flawless infinite scrolling (parallax) in vanilla JS. Use when the user requests background scenery.
argument-hint: "[landscape theme] [project path]"
---

# Parallax Landscape Generator (S3-Level Backgrounds)

2D platformers like Argentara require massive, horizontally elongated backgrounds that scroll at different speeds to create depth (parallax effect). This skill ensures Antigravity generates backgrounds that are perfectly seamless (ga putus-putus) and visually muted so they do not clash with the playable game layer.

## S3-Level Responsibilities

1. **Seamless Tiling Guarantee**: Backgrounds must wrap perfectly on the X-axis. The left edge of the image MUST match the right edge identically.
2. **Visual Hierarchy (Muting)**: The background must have lower contrast, lower saturation, or darker tones compared to the foreground. Players must never confuse a background mountain with a solid platform they can jump on.
3. **Elongated Aspect Ratio**: Force the generation or construction of wide textures (e.g., 3:1 or 4:1 aspect ratio) to minimize visible repetition.
4. **Infinite Parallax Rendering**: Implement the dual-draw Vanilla JS logic to loop the image endlessly based on camera movement.

## Process

1. **Read `references/seamless-parallax-rules.md`**.
2. **Generate / Construct Asset**: 
   - If using `generate_image`, the prompt MUST include: `16-bit pixel art, side-scrolling video game background, seamless horizontal tiling, low contrast, muted colors, extreme panoramic landscape`.
   - If generating programmatically, use mirroring techniques to guarantee seamless edges.
3. **Layer Setup**: Establish multiple layers (e.g., Sky = scrolls at 10% speed, Mountains = 30% speed, Trees = 60% speed).
4. **Validation Check**: 
   - Does the background distract from the main game layer? (If yes, darken it).
   - Is there a visible "seam" or vertical line where the image repeats? (If yes, fix the wrapping logic or image edges).

## Cross-Skill Synergy

- Integrates with `core-game-architecture` to run the scrolling calculations inside the main `render()` loop based on the global Camera X position.

## References

- [Seamless Parallax Rules](references/seamless-parallax-rules.md)
