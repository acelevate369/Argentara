

import { InputHandler } from './input.js';
import { Player } from './player.js';
import { Level } from './level.js';
import { UIManager } from './ui.js';
import { checkAABB } from './physics.js';
import { SuboAI } from './boss.js';

const STATE = { // state game saat ini
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    WARTA: 'WARTA', // popup edukasi
    QUIZ: 'QUIZ', // modal kuis
    BOSS_FIGHT: 'BOSS_FIGHT', // state saat lawan subo
    GAME_OVER: 'GAME_OVER',
    WIN: 'WIN'
};
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
        this.currentLevel = 1;
        this.boss = null;
        
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
        this.ui.onStartGame(() => this.startGame(1));
        this.ui.onRetry(() => this.startGame(this.currentLevel));
        this.ui.onBackToMenu(() => this.goToMenu());
    }

    startGame(levelNumber = 1) { // inisialisasi level dan mulai bermain
        if (levelNumber === 1) {
            this.player.score = 0; // Reset score cuma dari level 1
        }
        this.currentLevel = levelNumber;
        this.level.load(this.currentLevel);

        const spawn = this.level.data.playerSpawn;
        this.player.spawnX = spawn.x;
        this.player.spawnY = spawn.y;
        this.player.reset();
        
        // Bersihkan data boss state lama
        this.boss = null;
        this.player.quizCorrect = 0; // Reset counter quiz per level

        this.camera.x = 0;

        this.ui.hideMenu();
        this.ui.showHUD();
        this.ui.updateHUD(this.player.score, 0, this.level.data.requiredBars, this.currentLevel);
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
        if (this.state !== STATE.PLAYING && this.state !== STATE.BOSS_FIGHT) {
            this.input.clearJustPressed();
            return;
        }

        this.player.update(this.input, this.level.data.platforms);
        this.level.update();

        // Cek spawn Boss di level 3
        if (this.state === STATE.PLAYING && this.level.data.hasBoss && this.player.quizCorrect >= 5 && !this.boss) {
            this.boss = new SuboAI(4600, 300);
            this.state = STATE.BOSS_FIGHT;
            this.ui.showMission("KALAHKAN SUBO!");
        }

        // Update Boss
        if (this.state === STATE.BOSS_FIGHT && this.boss) {
            this.boss.update(this.player, this.level.data.platforms);
            
            // Kunci kamera di arena boss
            const arena = this.level.data.bossArena;
            this.camera.x = arena.x;
            if (this.player.x < arena.x) this.player.x = arena.x;
            if (this.player.x > arena.x + arena.width - this.player.w) this.player.x = arena.x + arena.width - this.player.w;
            
            // Hit detection boss
            if (checkAABB(this.player, this.boss)) {
                // Injak bos (jika player falling)
                if (this.player.vy > 0 && this.player.y + this.player.h < this.boss.y + 20) {
                    this.player.vy = -12; // Bounce back
                    if (this.boss.takeDamage()) {
                        this.player.score += 500;
                        if (this.boss.hp <= 0) {
                            this.state = STATE.WIN;
                            this.player.score += 2000;
                            this.ui.showWin(this.player.score, this.player.barsCollected, this.level.data.requiredBars);
                            this._saveHighScore(this.player.score);
                            return;
                        }
                    }
                } else {
                    // Player kena damage boss (game over hardcore)
                    if (!this.boss.invulnerable) {
                        this.player.alive = false;
                        this.state = STATE.GAME_OVER;
                        this.ui.showGameOver(this.player.score);
                        this.currentLevel = 1; // Hukuman kembali ke level 1
                        return;
                    }
                }
            }
        }

        if (this.state === STATE.PLAYING) {
            const events = this.level.checkInteractions(this.player);
            this._handleEvents(events);
        }

        if (this._nearNPC && !this._nearNPC.quizDone) {
            this.ui.showNPCPrompt();
            if (this.input.isJustPressed('KeyE')) {
                this._startQuiz(this._nearNPC);
            }
        } else {
            this.ui.hideNPCPrompt();
        }

        this._nearNPC = null;

        if (this.state !== STATE.BOSS_FIGHT) {
            this.camera.follow(this.player, this.level.data.width);
        }

        this.ui.updateHUD(
            this.player.score, 
            this.player.barsCollected, 
            this.level.data.requiredBars,
            this.currentLevel
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
                    if (this.currentLevel < 3) {
                        this.player.score += 300; // Bonus stage clear
                        this.startGame(this.currentLevel + 1);
                    } else {
                        // Harusnya tidak sampai sini di Level 3 (karena lawan boss)
                        this.state = STATE.WIN;
                        this.ui.showWin(this.player.score, this.player.barsCollected, this.level.data.requiredBars);
                    }
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
            } else {
                this.player.score -= 200; // Penalti jawaban salah
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

        if (this.boss && (this.state === STATE.BOSS_FIGHT || this.state === STATE.WIN)) {
            this.boss.draw(ctx, camX);
        }

        if (this.state === STATE.WARTA || this.state === STATE.QUIZ) {

        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
