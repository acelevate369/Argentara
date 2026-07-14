---
name: core-game-architecture
description: Initiate or validate the core architecture for the Argentara project. Establishes a zero-bug, S3-level vanilla JS foundation including the main Game Loop, State Machine (Levels 1-3 & Boss), and Entity-Component-System (ECS) or modular architecture without any external framework dependencies. Use when building or refactoring the main game engine structure.
argument-hint: "[action: setup|validate] [project path]"
---

# Core Game Architecture (Vanilla JS S3-Level)

Argentara requires an extreme level of precision. **NEVER** use bloated frameworks. We operate purely on high-performance Vanilla JS with a strict architectural pattern. 

## Architectural Philosophy

| Layer | Responsibility | S3-Level Criteria |
| ----- | -------------- | ----------------- |
| **Game Loop** | Controls timing, fixed `dt` update, variable render | Decoupled logic and rendering, `requestAnimationFrame`, zero frame skipping. |
| **State Machine** | Manages states: Menu, Level 1, Level 2, Level 3, Boss, Game Over | Immutable state transitions, automatic cleanup of prior state. |
| **Entities & Logic** | Player, Warta, Silver, NPCs (Cak Sura, Cak Baya), Enemies | Modular classes or ECS. Total memory isolation. |
| **Event Bus** | Decoupled communication | Singleton event dispatcher, strict memory leak prevention (remove listeners). |

## Process

1. **Read `references/architecture-rules.md`** before touching any structural code.
2. **Validate Game Loop**: Ensure the update step runs at fixed intervals (e.g., 60Hz), while rendering interpolates if necessary.
3. **Verify State Transitions**: 
   - `Level 1` -> `Level 2` -> `Level 3` -> `Boss Fight`
   - `Any Level` -> `Game Over` (Resets points & info).
4. **Execute Architectural Deliverables**: Implement classes or managers required.
5. **Run Architecture Check**:
   - [ ] No global variable pollution (except the main `Game` object).
   - [ ] All event listeners have matching `removeEventListener` during state teardown.
   - [ ] Update and Render logic are strictly separated.

## Level Transition Details

- **Level 1 & 2**: Player collects `Warta` (Information points) and `Silver` (Score points). No bosses. Hazards include holes and traps. End of level triggers Quiz state.
- **Level 3**: Similar mechanics, but 5 quizzes must be answered correctly before `Subo` (Main Boss) appears.
- **Game Over**: Resets all Warta (Information points) to 0. Forces player to restart from Level 1 to re-gather info.

## S3-Level Constraints

- **Zero Global State Bloat**: Encapsulate within an IIFE or ES6 Modules.
- **Performance**: Garbage collection pauses must be avoided by object pooling (reusing objects instead of `new` and `delete` continuously).

## References

- [Architecture Rules](references/architecture-rules.md)
