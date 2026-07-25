---
name: performance-60fps-master
description: Optimizes the Vanilla JS engine to maintain a strict, unwavering 60 FPS on all devices. Use when refactoring rendering loops, optimizing physics checks, or mitigating garbage collection pauses.
argument-hint: "[action: profile|optimize] [project path]"
---

# Performance 60FPS Master

A game that drops frames is unplayable and breaks the S3-level requirement. This skill dictates how to write high-performance JavaScript for the Argentara rendering pipeline.

## Performance Bottlenecks

| Issue | Cause | S3-Level Solution |
| ----- | ----- | ----------------- |
| **GC Pauses (Stutter)** | Creating arrays/objects in `update()` | Object Pooling. Mutate existing objects instead of returning new ones. |
| **Draw Call Overhead** | Calling `ctx.drawImage` 5000 times | Frustum Culling (only draw what is on-screen). Sprite atlasing. |
| **Layout Thrashing** | Reading/Writing DOM iteratively | Batch DOM reads, then batch DOM writes. Avoid touching DOM during Canvas render. |

## Process

1. **Read `references/rendering-optimization.md`**.
2. **Spatial Partitioning**: For physics, do not check collision between the player and every single Warta/Silver/Trap in the level. Implement a Grid or QuadTree, or at least only check entities within the camera bounds.
3. **Culling Check**:
   - `if (entity.x > camera.right || entity.x + entity.w < camera.left) return;` // Skip render
4. **Canvas Batching**: Minimize state changes. Do not call `ctx.fillStyle = 'black'` before drawing every single block. Sort draw calls by texture or color to minimize context switching.
5. **Execution Validation**: Verify that the time taken by `update()` + `render()` is strictly under 16.6ms.

## Pre-Computation

Never calculate heavy math (like `Math.sqrt` or `Math.sin`) repeatedly inside the game loop if the result is static. Pre-compute values into lookup tables or constant variables during level initialization.

## References

- [Rendering Optimization](references/rendering-optimization.md)
