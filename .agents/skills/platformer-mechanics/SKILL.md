---
name: platformer-mechanics
description: Implements zero-bug, extreme-precision physics and collision algorithms for 2D platforming (Gravity, Jumping, Collision with ground, traps, and holes). S3-level optimization for handling player interaction with Warta and Silver pickups. Use when editing player movement, hitbox logic, or environmental hazards.
argument-hint: "[action: movement|collision|physics] [project path]"
---

# Platformer Mechanics (S3-Level Physics Engine)

Argentara requires a deterministic custom physics engine. The platformer logic must NEVER glitch. Players cannot be allowed to clip through walls, fall endlessly, or double-jump illegally.

## Core Responsibilities

1. **AABB Collision Detection**: Axis-Aligned Bounding Box must be mathematically flawless.
2. **Sub-step Resolution**: To prevent "tunneling" (where a fast-moving object passes completely through a thin wall in a single frame).
3. **Hazard Handling**: Traps and Holes immediately trigger player damage or Game Over logic depending on state.
4. **Pickup Handling**: Warta (Information) and Silver points use lightweight overlap checks.

## Process

1. **Read `references/collision-physics.md`** before touching velocity or position logic.
2. **Apply Forces**: Gravity must be applied *before* collision checks.
3. **Calculate Intent**: Calculate the desired position `(x + dx, y + dy)`.
4. **Resolve Collisions**:
   - Resolve Y-axis collisions first (Ground/Ceiling).
   - If grounded, reset vertical velocity and allow jumping.
   - Resolve X-axis collisions second (Walls).
5. **Update State**: Commit the final calculated position to the Player entity.

## Implementation Details

- **Warta & Silver**: These are non-solid triggers. Use a separate spatial grid or simple distance check to detect overlap. Do not run heavy AABB sweeping against them.
- **Holes**: Defined as "kill volumes" below the playable area. If `player.y > level.killZ`, trigger Level Reset / Game Over.
- **Traps**: Spike traps check AABB overlap but deal specific damage amounts.

## Zero-Bug Mandate

- **Floating Point Errors**: JavaScript uses IEEE 754. Always round positions to integer values *only during rendering*, keep floating point logic for internal math to preserve momentum, but cap values so `velocity.y` doesn't approach infinity.

## References

- [Collision & Physics Rules](references/collision-physics.md)
