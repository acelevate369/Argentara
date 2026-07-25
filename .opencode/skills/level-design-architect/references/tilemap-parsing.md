# Tilemap Parsing & Collision Merging

This document defines the S3-Level standards for reading and rendering 2D grid maps in Argentara.

## 🔴 CRITICAL: The Collision Optimization Rule (Hitbox Merging)

**Amateur Approach:** 
If a floor is made of 100 tiles, an amateur loop creates 100 separate hitboxes. When the player walks across it, the engine checks collisions against 100 distinct squares. This kills CPU performance.

**S3-Level Approach (Hitbox Merging):**
During the initial parse of the map array, the engine must merge adjacent solid tiles on the same Y-axis (or X-axis) into a single, massive bounding box.
- A 100-tile flat floor becomes **1** collision box.
- The visual rendering still draws 100 textures, but the physics engine only checks 1 box.

```javascript
// Conceptual Merging Logic
function generateHitboxes(grid) {
    const hitboxes = [];
    for (let y = 0; y < grid.length; y++) {
        let currentBox = null;
        for (let x = 0; x < grid[y].length; x++) {
            if (isSolid(grid[y][x])) {
                if (!currentBox) {
                    currentBox = { x: x * TILE_SIZE, y: y * TILE_SIZE, w: TILE_SIZE, h: TILE_SIZE };
                } else {
                    currentBox.w += TILE_SIZE; // Extend the box horizontally
                }
            } else {
                if (currentBox) {
                    hitboxes.push(currentBox);
                    currentBox = null;
                }
            }
        }
        if (currentBox) hitboxes.push(currentBox);
    }
    return hitboxes;
}
```

## Level Data Structure

The level data should be clean and decoupled from logic. 

```javascript
const Level1 = {
    id: 1,
    name: "Awal Penemuan",
    tileSize: 16,
    gridWidth: 50,
    gridHeight: 15,
    // 0 = Sky, 1 = Dirt, 2 = Grass, 8 = Warta, 9 = Silver
    layout: [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,8,0,0,0,9,9,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [1,1,1,1,1,0,0,1,1,1],
        // ...
    ]
};
```

## Camera Culling
When iterating to draw the map in the `render(ctx)` function, do NOT loop from `0` to `gridWidth`. Calculate the start and end indices based on the camera position.
```javascript
const startCol = Math.floor(camera.x / TILE_SIZE);
const endCol = startCol + (camera.width / TILE_SIZE) + 1;
// Only loop through startCol to endCol
```
