---
name: level-design-architect
description: Implements an S3-Level Tilemap parsing and rendering system for 2D platformer grids. Use this when the user wants to add, modify, or design new levels, place entities (Warta, Silver, Cak Sura), or generate collision boundaries dynamically from grid data.
argument-hint: "[action: setup|parse|render] [project path]"
---

# Level Design Architect (S3 Tilemap Master)

To prevent hardcoding coordinates for every single floor tile, trap, and NPC, Argentara utilizes a dynamic Tilemap parsing system. This allows the user to design levels as numerical arrays (or via external tools like Tiled JSON exports) while the engine intelligently handles rendering and collision generation.

## S3-Level Responsibilities

1. **Map Parsing**: Convert 2D arrays or JSON grid data into physical game entities.
2. **Chunking / Culling**: Only render tiles that are currently visible within the camera's viewport to maintain 60 FPS (integrates with `performance-60fps-master`).
3. **Collision Generation (Hitbox Merging)**: Instead of creating a separate physics hitbox for every single 16x16 pixel floor tile, the parser must merge adjacent solid tiles into a single large AABB hitbox to vastly improve physics performance (integrates with `platformer-mechanics`).

## Process

1. **Read `references/tilemap-parsing.md`**.
2. **Define Tile Dictionary**: Ensure there is a clear mapping between ID integers and their function. (e.g., `0 = Empty`, `1 = Ground`, `2 = Spikes`, `9 = Player Spawn`, `10 = Cak Sura`).
3. **Parse Loop**: Iterate through the level array ONCE during level load.
4. **Instantiate Entities**: For interactive elements (Warta, Quizzes, Enemies), spawn the respective class objects and push them to the Level's entity array.
5. **Cross-Skill Synergy**:
   - **UI**: Ensure the UI layer (`ui-pixel-master`) scales the grid rendering correctly.
   - **Quiz**: Place `quiz-dialogue-system` trigger zones where NPC tiles are placed.

## Cross-Referencing Strictness

When adding a new level, do NOT break the S3 rules from other skills. The tiles must be rendered with `imageSmoothingEnabled = false` and physics must adhere to the fixed timestep.

## References

- [Tilemap Parsing & Merging](references/tilemap-parsing.md)
