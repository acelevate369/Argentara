import { Player } from './js/player.js';
import { InputHandler } from './js/input.js';
import { Level } from './js/level.js';

global.window = { addEventListener: () => {} };

const player = new Player(80, 400);
const input = new InputHandler();
const level = new Level();
level.load(3);

console.log("Start Player X:", player.x, "Y:", player.y);
input.keys['ArrowRight'] = true;

for(let i=0; i<60; i++) {
    player.update(input, level.data.platforms);
}
console.log("End Player X:", player.x, "Y:", player.y);
