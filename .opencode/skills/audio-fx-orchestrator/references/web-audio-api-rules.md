# Web Audio API Rules

This document dictates the S3-Level implementation of audio in Argentara.

## 🔴 CRITICAL: User Interaction Requirement

Modern browsers (Chrome, Safari) strictly enforce an "Autoplay Policy". The `AudioContext` will remain in a `suspended` state until the user interacts with the document (click, tap, keydown).

**S3-Level Solution:**
The game MUST have a "Click to Start" or "Press Start" initial menu before Level 1 begins. 
Upon this first interaction, execute:
```javascript
if (audioContext.state === 'suspended') {
    audioContext.resume();
}
```

## Decoding & Caching (Zero Latency)

Never load a sound effect from the network at the exact moment it needs to be played.

```javascript
// S3-Level SFX Caching
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const audioBuffers = {};

async function loadSound(name, url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    audioBuffers[name] = audioBuffer;
}

// Call this during game load
// await loadSound('jump', 'assets/sounds/jump.wav');
```

## Playing SFX (Garbage Collection Safe)

Creating a `BufferSourceNode` is cheap and designed to be "fire and forget". It will automatically be garbage collected once it finishes playing.

```javascript
function playSFX(name, volume = 1.0) {
    if (!audioBuffers[name]) return;
    
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffers[name];
    
    const gainNode = audioCtx.createGain();
    gainNode.gain.value = volume;
    
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    source.start(0);
}
```

## The Typewriter Effect (Dialogue)
When Cak Sura speaks, a blip sound should play per letter. If the letter is rendered every 50ms, playing a long 200ms audio file repeatedly will overlap and distort (clipping). 
- **Rule:** The `blip.wav` must be strictly trimmed to < 40ms.
- **Rule:** If the same SFX is already playing, you may need to limit the polyphony (max concurrent blips = 2) to prevent ear-rape volume stacking.
