---
name: quiz-dialogue-system
description: Implements the logic for NPC interactions (Cak Sura, Cak Baya), Information (Warta) gating, and the quiz engine. Use when creating or modifying the question/answer flow, reward calculation, and level-end checks.
argument-hint: "[action: quiz|dialogue] [project path]"
---

# Quiz & Dialogue System

Argentara's unique mechanic involves collecting Warta (Information) in the platformer level, which then dictates the player's ability to answer quizzes accurately. This requires an S3-Level logic tree to handle gating, correct/incorrect handling, and dynamic NPC dialogues.

## The Logic Flow

| Entity | Role | Logic Requirement |
| ------ | ---- | ----------------- |
| **Warta** | Information Node | If missed, the quiz option either becomes hidden, locked, or the player is forced to guess blindly (depending on design). |
| **Cak Sura / Cak Baya** | NPCs / Quizmasters | Handles the dialogue tree. Asks questions based on collected Warta. |
| **Quiz State** | Flow Controller | Pauses the platformer engine. Switches UI to Quiz Mode. |

## Process

1. **Read `references/quiz-logic-rules.md`**.
2. **State Transition**: When colliding with a Quizmaster, push the Game State to `QUIZ_STATE`. (Pause physics, halt player input).
3. **Warta Check**: Iterate over the `player.collectedWarta` array. 
4. **Generate Question**:
   - If player has Warta for Question 1 -> Display exact answer option.
   - If player lacks Warta -> Display vague/trick options.
5. **Validate Answer**:
   - If Correct: Grant Silver / Points.
   - If Incorrect: Trigger punishment (deduct points, or trigger Game Over depending on Level severity).
6. **Level 3 Condition**: Player MUST answer 5 questions correctly to trigger the Subo Boss Fight.

## Data Structure S3 Standard

Questions must NEVER be hardcoded into the dialogue rendering function. They MUST be stored in a decoupled JSON/Object structure (e.g., a `quiz-database.js` file) to ensure single-responsibility principle.

## References

- [Quiz Logic Rules](references/quiz-logic-rules.md)
