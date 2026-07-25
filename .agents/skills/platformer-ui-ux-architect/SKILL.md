---
name: platformer-ui-ux-architect
description: Implements S3-level UX psychology and UI layout specifically designed for 2D platformer games. Focuses on intuitive menus, non-intrusive HUDs, clear player feedback (visual/audio cues for taking damage, gaining items), and reducing cognitive load during quizzes.
argument-hint: "[action: layout|feedback|quiz-ux] [project path]"
---

# Platformer UI/UX Architect (S3-Level Game Psychology)

While `ui-pixel-master` handles the technical rendering of pixels, this skill dictates the **psychological and structural design** of the user experience (UX). An S3-Level game developer understands that UI must not obstruct gameplay, and every player action must have an immediate, satisfying response.

## S3-Level UX Responsibilities

1. **Non-Intrusive HUD**: The Heads-Up Display (HP, Silver, Warta) must provide vital info without blocking platforming hazards.
2. **Action Feedback ("Juiciness")**: Every significant event (getting hit, collecting an item, answering a quiz correctly) must trigger a micro-animation, particle effect, or screen shake.
3. **Cognitive Load Reduction**: The Quiz interface must be incredibly clean. The player should not have to hunt for the "Next" button.

## Process

1. **Read `references/ui-ux-game-principles.md`**.
2. **Layout Design**: Place HUD elements strictly in the safe zones (usually top-left and top-right corners). If the player jumps into the corner, the HUD must temporarily fade (reduce opacity) to reveal the gameplay behind it.
3. **Feedback Implementation**:
   - *Damage*: Flash the player sprite white, implement a 100ms freeze-frame (hit-stop), and trigger a minor camera shake.
   - *Collectibles*: Spawn a floating "+1" text that drifts upwards and fades out.
4. **Quiz UX**: 
   - Ensure interactive buttons have a distinct "Hover/Focus" state and an "Active/Pressed" state.
   - Provide immediate visual confirmation (Green flash for correct, Red flash for wrong) before advancing to the next dialogue.

## Cross-Skill Synergy

- Must collaborate with `ui-pixel-master` to ensure the UX layouts don't break the 16-bit integer scaling.
- Must coordinate with `audio-fx-orchestrator` so every visual UX feedback has a corresponding audio cue.

## References

- [UI/UX Game Principles](references/ui-ux-game-principles.md)
