---
name: boss-fight-engine
description: Establish the combat logic and AI behavior for Subo, the main villain in Level 3. Use when scripting boss attack patterns, phases, hitboxes, and game-over/victory sequences.
argument-hint: "[action: setup|patterns] [project path]"
---

# Boss Fight Engine (Subo S3-Level AI)

Level 3 culminates in a boss fight against Subo. This is a dramatic shift from standard platforming and requires a state-machine specifically for the boss's AI. The encounter must feel challenging, fair, and technically flawless.

## Subo AI Phases

| Phase | Trigger | Behavior Description |
| ----- | ------- | -------------------- |
| **Intro** | 5 Quizzes answered correctly | Cinematic pause, boss appears, locks camera within an arena. |
| **Phase 1** | 100% HP | Basic attack pattern (e.g., throwing projectiles, ground slams). |
| **Phase 2** | < 50% HP | Aggressive pattern (faster movement, tracking projectiles, complex dodges). |
| **Defeat** | 0% HP | Victory sequence triggers. Transitions to Village Scene. |

## Process

1. **Read `references/boss-ai-patterns.md`**.
2. **Arena Locking**: Constrain the player's X and Y coordinates to the boss arena so they cannot escape.
3. **Pattern Execution**: Utilize `timers` and the main `dt` loop to dictate when Subo attacks. **DO NOT** use `setTimeout` or `setInterval` as they desync from the game loop.
4. **Hit Detection**: 
   - Player hitting Subo (requires precise hitbox overlap).
   - Subo hitting Player.
5. **Win/Loss Condition**:
   - If Player HP <= 0: Subo Wins -> Reset Player to Level 1. Reset Warta to 0.
   - If Subo HP <= 0: Player Wins -> End Game Cinematic.

## Doctoral-Level Execution

- **State Machine Isolation**: Subo's logic must be isolated in a `SuboAI` class. It should not bleed into the global Player logic.
- **Telegraphing**: S3-level game design dictates that all boss attacks must be "telegraphed" (a visual cue 0.5s - 1s before the attack lands).

## References

- [Boss AI Patterns](references/boss-ai-patterns.md)
