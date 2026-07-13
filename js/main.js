

import { InputHandler } from './input.js';
import { Player } from './player.js';
import { Level } from './level.js';
import { UIManager } from './ui.js';
import { checkAABB } from './physics.js';

const STATE = { // state game saat ini
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    WARTA: 'WARTA', // popup edukasi
    QUIZ: 'QUIZ', // modal kuis
    GAME_OVER: 'GAME_OVER',
    WIN: 'WIN'
};

class Camera { // class untuk pergerakan kamera mengikuti player
    constructor(canvasWidth, canvasHeight) {
        this.x = 0;
        this.width = canvasWidth;
        this.height = canvasHeight;
    }

    follow(target, levelWidth) { // update posisi kamera agar smooth mengikuti target

        const targetCamX = target.x + target.w / 2 - this.width / 2;

        this.x += (targetCamX - this.x) * 0.1;

        this.x = Math.max(0, Math.min(this.x, levelWidth - this.width));
    }
}

class Game { // class utama yang mengatur game loop dan logic
    constructor() {

        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.input = new InputHandler();
        this.ui = new UIManager();
        this.level = new Level();
        this.camera = new Camera(this.canvas.width, this.canvas.height);

        this.player = new Player(80, 400);

        this.state = STATE.MENU;
        this.lastTime = 0;
        this.accumulator = 0;
        this.fixedDt = 1000 / 60; // 60 FPS target

        this._nearNPC = null;

        this._bindUICallbacks();

        this.highScore = parseInt(localStorage.getItem('argentara_highscore') || '0');

        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);

        console.log('%c🎮 ARGENTARA v0.1 - Game Initialized', 
            'color: #3cdc7c; font-size: 14px; font-weight: bold;');
    }

    _bindUICallbacks() {
        this.ui.onStartGame(() => this.startGame());
        this.ui.onRetry(() => this.startGame());
        this.ui.onBackToMenu(() => this.goToMenu());
    }

    startGame() { // inisialisasi level dan mulai bermain
        this.level.load(1);

        const spawn = this.level.data.playerSpawn;
        this.player.spawnX = spawn.x;
        this.player.spawnY = spawn.y;
        this.player.reset();

        this.camera.x = 0;

        this.ui.hideMenu();
        this.ui.showHUD();
        this.ui.updateHUD(0, 0, this.level.data.requiredBars, 1);
        this.ui.showMission(this.level.data.mission);
        this.ui.hideNPCPrompt();

        this.state = STATE.PLAYING;
        this._nearNPC = null;
    }

    goToMenu() {
        this.state = STATE.MENU;
        this.ui.hideHUD();
        this.ui.hideNPCPrompt();
        this.ui.showMenu();
    }

    gameLoop(timestamp) { // loop utama yang dipanggil browser setiap frame
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        const safeDelta = Math.min(deltaTime, 200);
        this.accumulator += safeDelta;

        while (this.accumulator >= this.fixedDt) {
            this.update();
            this.accumulator -= this.fixedDt;
        }

        this.draw();

        requestAnimationFrame(this.gameLoop);
    }

    update() { // update semua objek game (player, level, dll)
        if (this.state !== STATE.PLAYING) {
            this.input.clearJustPressed();
            return;
        }

        this.player.update(this.input, this.level.data.platforms);

        this.level.update();

        const events = this.level.checkInteractions(this.player);
        this._handleEvents(events);

        if (this._nearNPC && !this._nearNPC.quizDone) {
            this.ui.showNPCPrompt();
            if (this.input.isJustPressed('KeyE')) {
                this._startQuiz(this._nearNPC);
            }
        } else {
            this.ui.hideNPCPrompt();
        }

        this._nearNPC = null;

        this.camera.follow(this.player, this.level.data.width);

        this.ui.updateHUD(
            this.player.score, 
            this.player.barsCollected, 
            this.level.data.requiredBars
        );

        this.input.clearJustPressed();
    }

    _handleEvents(events) { // memproses event yang terjadi di level (nabrak rintangan, ambil koin dll)
        for (const event of events) {
            switch (event.type) {
                case 'collect_silver':

                    break;

                case 'collect_warta':

                    this.state = STATE.WARTA;
                    this.ui.showWarta(event.data.fact, () => {
                        this.state = STATE.PLAYING;
                    });
                    return; // Stop processing events, game paused

                case 'hit_hazard':

                    this.player.alive = false;
                    this.state = STATE.GAME_OVER;
                    this.ui.showGameOver(this.player.score);
                    this._saveHighScore(this.player.score);
                    return;

                case 'near_npc':
                    this._nearNPC = event.data;
                    break;

                case 'reach_finish':

                    this.state = STATE.WIN;
                    this.player.score += 300; // Bonus finish
                    this.ui.showWin(
                        this.player.score, 
                        this.player.barsCollected, 
                        this.level.data.requiredBars
                    );
                    this._saveHighScore(this.player.score);
                    return;

                case 'fell_off':

                    this.player.alive = false;
                    this.state = STATE.GAME_OVER;
                    this.ui.showGameOver(this.player.score);
                    this._saveHighScore(this.player.score);
                    return;
            }
        }
    }

    _startQuiz(npc) { // mulai kuis saat interaksi dengan npc
        this.state = STATE.QUIZ;
        const quizData = this.level.getQuiz(npc.quizIndex);
        
        this.ui.showQuiz(quizData, (wasCorrect) => {
            npc.quizDone = true;
            if (wasCorrect) {
                this.player.score += 200;
                this.player.quizCorrect++;
            }
            this.state = STATE.PLAYING;
        });
    }

    _saveHighScore(score) { // simpan skor tertinggi ke localstorage
        if (score > this.highScore) {
            this.highScore = score;
            localStorage.setItem('argentara_highscore', score.toString());
        }
    }

    draw() { // render semua grafik ke canvas
        const ctx = this.ctx;
        const camX = this.camera.x;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.state === STATE.MENU) {

            this.level.load(1); // Ensure level loaded for bg
            this.level.draw(ctx, 0, this.canvas.width, this.canvas.height);
            return;
        }

        this.level.draw(ctx, camX, this.canvas.width, this.canvas.height);

        if (this.player.alive) {
            this.player.draw(ctx, camX);
        }

        if (this.state === STATE.WARTA || this.state === STATE.QUIZ) {

        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
