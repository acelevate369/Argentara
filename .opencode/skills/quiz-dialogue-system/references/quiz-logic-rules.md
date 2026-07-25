# Quiz Logic Rules

This reference enforces how the Quiz and Dialogue engine operates in Argentara.

## 🔴 CRITICAL: Separation of Content and Logic

Do not write question strings directly inside `if` statements.

### The Required Data Schema
```javascript
const QuizDatabase = {
    level1: [
        {
            id: "q1",
            requiredWartaId: "w_silver_history",
            question: "Tahun berapa penemuan tambang perak terbesar terjadi?",
            options: [
                { text: "1545", isCorrect: true },
                { text: "1890", isCorrect: false },
                { text: "1200", isCorrect: false }
            ],
            hint: "Ingat warta di dekat tebing." // Optional
        }
    ]
}
```

## Warta Gating Logic
When a quiz triggers, the engine must verify if `player.inventory.includes(question.requiredWartaId)`.
- If `true`: Provide UI visual feedback (e.g., highlighting the text in blue) indicating the player's knowledge is active.
- If `false`: The player can still answer, but they risk failure.

## Level 3 Specifics (The Subo Gate)
Level 3 is the ultimate test.
1. The engine tracks `correctAnswers = 0`.
2. As Cak Sura and Cak Baya ask their 5 sequential questions, increment `correctAnswers`.
3. If `correctAnswers === 5`, trigger `boss-fight-engine` and summon Subo.
4. If `< 5`, trigger Level Restart sequence (or whatever penalty is dictated by the game design).

## Memory Leaks in UI
When binding click events to the multiple-choice buttons in the DOM/Canvas:
You MUST unbind the previous click events before rendering the next question.
Failure to use `removeEventListener` will result in phantom clicks scoring multiple points simultaneously (a severe QA failure).
