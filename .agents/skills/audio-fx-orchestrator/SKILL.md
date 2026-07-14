---
name: audio-fx-orchestrator
description: Manages the HTML5 Audio API / Web Audio API for flawless, overlapping sound effects and gapless background music (BGM). Ensures zero-latency playback for platformer jumps, traps, and UI interactions without leaking memory. Use when adding or editing sounds.
argument-hint: "[action: sfx|bgm] [project path]"
---

# Audio FX Orchestrator (S3-Level Sound)

In 8-bit/16-bit games, audio timing is everything. A jump sound that lags by 100ms destroys the game feel. The Audio Orchestrator strictly defines how to cache, pool, and play sounds using Vanilla JS.

## The Web Audio API Mandate

While `<audio>` tags are fine for background music, they are **UNACCEPTABLE** for rapid Sound Effects (SFX) like jumping, collecting Silver, or UI typing blips, due to browser latency and concurrency limits.

**You MUST use the `AudioContext` API for SFX.**

## Process

1. **Read `references/web-audio-api-rules.md`**.
2. **Pre-loading**: All SFX (`jump.wav`, `coin.wav`, `hurt.wav`, `blip.wav`) must be loaded via `fetch` as `ArrayBuffer`s and decoded into `AudioBuffer`s during the Level 1 Loading Screen.
3. **Playback Execution**: To play a sound, create a new `BufferSourceNode`, attach the cached `AudioBuffer`, connect it to the `destination`, and call `start()`. 
4. **Volume Control**: Route all SFX through a master `GainNode` to allow players to adjust SFX and BGM volumes independently.
5. **BGM Looping**: Background music (e.g., Subo's Boss Theme) must be set to `loop = true`. Ensure the audio file is trimmed perfectly to avoid "hiccups" at the loop point.

## Spatial Audio (Optional for S3)
For advanced immersion, traps or NPCs (Cak Sura) can use a `StereoPannerNode` based on their X-coordinate relative to the player, shifting the audio slightly left or right.

## References

- [Web Audio API Rules](references/web-audio-api-rules.md)
