window.gameSettings = {
    bgmVolume: 1.0,
    sfxVolume: 1.0,
    bgmBase: 0.6
};

import { InputHandler } from './input.js';
import { Player } from './player.js';
import { Level } from './level.js';
import { UIManager } from './ui.js';
import { checkAABB } from './physics.js';
import { SuboAI } from './boss.js';

const STATE = { // state game saat ini
    MENU: 'MENU',
    PLAYING: 'PLAYING',
    VN_DIALOG: 'VN_DIALOG', // state saat dialog visual novel
    CUTSCENE: 'CUTSCENE', // state untuk cutscene ingame
    WARTA: 'WARTA', // popup edukasi
    QUIZ: 'QUIZ', // modal kuis
    BOSS_FIGHT: 'BOSS_FIGHT', // state saat lawan subo
    PAUSE: 'PAUSE',
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
        this.input.setupTouchControls();
        this.ui = new UIManager();
        this.level = new Level();
        this.level.load(1); // Load Level 1 initially for the menu background
        this.camera = new Camera(this.canvas.width, this.canvas.height);

        this.player = new Player(80, 400);

        this.state = STATE.MENU;
        this.currentLevel = 1;
        this.boss = null;
        
        this.lastTime = 0;
        this.accumulator = 0;
        this.fixedDt = 1000 / 60; // 60 FPS target

        this.hitStopTimer = 0;
        this.shakeTimer = 0;
        this.floatingTexts = []; // Array untuk menampung efek floating damage text

        this._nearNPC = null;
        

        this.unlockedLevel = parseInt(localStorage.getItem('argentara_unlocked_level') || '1');

        this._bindUICallbacks();

        this.highScore = parseInt(localStorage.getItem('argentara_highscore') || '0');

        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);

        console.log('%c🎮 ARGENTARA v0.1 - Game Initialized', 
            'color: #3cdc7c; font-size: 14px; font-weight: bold;');
    }

    _setBGMVolume(baseVol) {
        const bgm = document.getElementById('bgm');
        if (bgm) {
            window.gameSettings.bgmBase = baseVol;
            bgm.volume = baseVol * window.gameSettings.bgmVolume;
        }
    }

    _bindUICallbacks() {
        this.ui.onStartGame(() => this.startGame(1));
        this.ui.onRetry(() => this.startGame(this.currentLevel));
        this.ui.onBackToMenu(() => this.goToMenu());
        this.ui.onResume(() => {
            if (this.state === STATE.PAUSE) {
                this.state = this.savedState;
                this.ui.hidePause();
            }
        });
        this.ui.onPauseMenu(() => {
            if (this.state === STATE.PAUSE) {
                this.ui.hidePause();
                this.goToMenu();
            }
        });
        this.ui.onSelectLevel((action, levelNum) => {
            if (action === 'show') {
                document.querySelectorAll('.btn-level').forEach(btn => {
                    const lNum = parseInt(btn.dataset.level);
                    if (lNum <= this.unlockedLevel) {
                        btn.classList.remove('btn-locked');
                        btn.innerHTML = `LEVEL ${lNum}`;
                    } else {
                        btn.classList.add('btn-locked');
                        btn.innerHTML = `LEVEL ${lNum} <svg class="icon-lock" width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M4 2h4v3H4V2zm-2 3h8v6H2V5zm3 2h2v2H5V7z"/></svg>`;
                    }
                });
                this.ui.elements.levelMenuScreen.classList.remove('hidden');
            } else if (action === 'start') {
                if (levelNum <= this.unlockedLevel) {
                    this.startGame(levelNum);
                }
            }
        });

    }

    startGame(levelNumber = 1) { // inisialisasi level dan mulai bermain
        // Coba aktifkan fullscreen saat mulai main (dibutuhkan user gesture)
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            try {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.log("Fullscreen gagal:", err);
                    });
                }
            } catch (e) {}
        }
        
        this.player.score = 0;
        
        this.currentLevel = levelNumber;
        this.level.load(this.currentLevel);

        const spawn = this.level.data.playerSpawn;
        this.player.spawnX = spawn.x;
        this.player.spawnY = spawn.y;
        this.player.reset();
        
        this.state = STATE.PLAYING;
        
        // Bersihkan data boss state lama
        this.boss = null;
        this.bossDefeated = false;
        this.player.quizCorrect = 0;

        // Reset hitstop & shake
        this.hitStopTimer = 0;
        this.shakeTimer = 0;
        
        this.player.hp = this.player.maxHp;

        this.camera.x = 0;

        // Sembunyikan SEMUA overlay agar tidak ada layar stale yang menumpuk
        this.ui.hideMenu();
        this.ui.hideGameOver();
        this.ui.hideWin();
        this.ui.hidePause();
        this.ui.hideQuiz();
        this.ui.hideWarta();
        this.ui.hideNPCPrompt();
        if (this.ui.elements.levelMenuScreen) {
            this.ui.elements.levelMenuScreen.classList.add('hidden');
        }

        this.ui.showHUD();
        this.ui.updateHUD(this.player.score, 0, this.level.data.requiredBars, this.currentLevel, this.player.hp, -1);
        this.ui.showMission(this.level.data.mission);

        this._nearNPC = null;
        this._updateBGM(); // Set BGM first based on level

        if (this.currentLevel === 1) {
            this.state = STATE.CUTSCENE;
            this.ui.hideHUD();
            this.ui.elements.missionBanner.classList.add('hidden');
            
            // Dim BGM
            const bgm = document.getElementById('bgm');
            this._setBGMVolume(0.05);
            
            // TUNGGU BENTAR BEBERAPA DETIK
            setTimeout(() => {
                // SUBO LOMPAT ENTAH DARIMANA MASUK KE FRAME (Cinematic Arc)
                this.boss = new SuboAI(this.player.x + 200, this.player.y - 50); 
                this.boss.state = 'ATTACK_ANTIAIR'; // Sprite lompat
                this.boss._lastFaceRight = false; // Hadap kiri (Galuh)
                this.boss.vx = -2.5;  // Geser pelan ke kiri
                this.boss.vy = -10; // Lompat ke atas membentuk lengkungan (arc)
                
                // Biarkan jatuh dulu dengan gaya cinematic (slow motion)
                setTimeout(() => {
                    this.state = STATE.VN_DIALOG;
                    
                    const dialogs = [
                        { speaker: 'Subo', text: 'Hahahaha! Semua aset perak ini milikku! Tanpa literasi, kalian warga Argentara hanya akan menjadi budak inflasiku!', side: 'right' },
                        { speaker: 'Galuh', text: 'Berhenti kau, Subo! Harta dan ilmu itu milik rakyat!', side: 'left' },
                        { speaker: 'Subo', text: 'Kalau kau mau mengambilnya, temui aku di Puncak Balai! Itu pun kalau kau bisa melewati ujian Cak Sura dan Cak Baya!', side: 'right' }
                    ];
                    
                    this.ui.showVNDialog(dialogs, () => {
                        if (this.boss) {
                            // SETELAH DIALOG SELESAI, SUBO LOMPAT LAGI KE KANAN
                            this.state = STATE.CUTSCENE;
                            this.boss.state = 'ATTACK_ANTIAIR'; // Sprite lompat
                            // Cinematic leap out
                            this.boss.vy = -15; 
                            this.boss.vx = 7; 
                            this.boss._lastFaceRight = true; 
                            
                            // Tunggu 2 detik biar dia mengudara perlahan keluar layar
                            setTimeout(() => {
                                this.state = STATE.PLAYING;
                                this.boss = null; 
                                this.ui.showHUD();
                                this.ui.elements.missionBanner.classList.remove('hidden');
                                this._setBGMVolume(0.2);
                            }, 2000);
                        } else {
                            this.state = STATE.PLAYING;
                            this.ui.showHUD();
                            this.ui.elements.missionBanner.classList.remove('hidden');
                            if (bgm) bgm.volume = 0.2 * window.gameSettings.bgmVolume;
                        }
                    });
                }, 1000); // Waktu yang cukup untuk Subo mendarat
            }, 1500); // Tunggu 1.5 detik di awal level
        } else {
            this.state = STATE.PLAYING;
        }
    }

    _updateBGM() {
        const bgm = document.getElementById('bgm');
        if (!bgm) return;
        
        let targetSrc = '';
        if (this.state === STATE.MENU) {
            targetSrc = 'asset/music & SFX/02. Lively City.mp3';
        } else if (this.state === STATE.BOSS_FIGHT) {
            targetSrc = 'asset/music & SFX/Gatekeeper’s_Final_Stand.mp3';
        } else {
            if (this.currentLevel === 1) {
                targetSrc = 'asset/music & SFX/02. Lively City.mp3';
            } else if (this.currentLevel === 2) {
                targetSrc = 'asset/music & SFX/Morning_at_the_Bamboo_Gate.mp3';
            } else if (this.currentLevel === 3) {
                targetSrc = 'asset/music & SFX/Surabaya_Rooftops.mp3';
            }
        }
        
        if (targetSrc) {
            if (bgm.dataset.currentTrack !== targetSrc) {
                bgm.dataset.currentTrack = targetSrc;
                bgm.src = targetSrc;
                bgm.load(); // Paksa browser untuk reload sumber audio yang baru
                this._setBGMVolume(0.2);
                bgm.play().catch(e => console.log('Wait for interaction'));
            }
        }
    }

    elements_levelMenu_hide() {
        // Helper: hide level menu screen if visible
        if (this.ui.elements.levelMenuScreen) {
            this.ui.elements.levelMenuScreen.classList.add('hidden');
        }
    }

    goToMenu() {
        this.state = STATE.MENU;
        this.level.load(1); // Load Level 1 background for menu

        // Reset boss & combat state
        this.boss = null;
        this.bossDefeated = false;
        this.hitStopTimer = 0;
        this.shakeTimer = 0;

        // Sembunyikan semua overlay
        this.ui.hideHUD();
        this.ui.hideNPCPrompt();
        this.ui.hideGameOver();
        this.ui.hideWin();
        this.ui.hidePause();
        this.ui.hideQuiz();
        this.ui.hideWarta();
        this.elements_levelMenu_hide();

        this.ui.showMenu();
        this._updateBGM();
    }

    gameLoop(timestamp) { // loop utama yang dipanggil browser setiap frame
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        const safeDelta = Math.min(deltaTime, 200);
        this.accumulator += safeDelta;

        if (this.shakeTimer > 0) {
            this.shakeTimer -= this.fixedDt;
        }

        while (this.accumulator >= this.fixedDt) {
            this.update();
            this.accumulator -= this.fixedDt;
        }

        this.draw();

        requestAnimationFrame(this.gameLoop);
    }

    update() { // update semua objek game (player, level, dll)
        if (this.input.isJustPressed('Escape')) {
            if (this.state === STATE.PLAYING || this.state === STATE.BOSS_FIGHT) {
                this.savedState = this.state;
                this.state = STATE.PAUSE;
                this.ui.showPause();
                this.input.clearJustPressed();
                return;
            } else if (this.state === STATE.PAUSE) {
                this.state = this.savedState;
                this.ui.hidePause();
                this.input.clearJustPressed();
                return;
            } else if (this.state === STATE.WARTA) {
                this.ui.hideWarta();
                this.state = STATE.PLAYING;
                this.input.clearJustPressed();
                return;
            } else if (this.state === STATE.QUIZ) {
                // Jangan paksa tutup kuis untuk mencegah bypass
            }
        }

        if (this.state !== STATE.PLAYING && this.state !== STATE.BOSS_FIGHT) {
            // Khusus VN_DIALOG dan CUTSCENE, update fisika player dan boss TANPA input user
            if (this.state === STATE.VN_DIALOG || this.state === STATE.CUTSCENE) {
                // Biarkan Galuh jatuh ke tanah (dummy input)
                const dummyInput = { isPressed: () => false, isJustPressed: () => false };
                this.player.update(dummyInput, this.level.data.platforms);

                if (this.boss) {
                            // Cinematic Gravity (Efek Slow Motion)
                            let cinematicGravity = this.boss.gravity * 0.45;
                            this.boss.vy += cinematicGravity;
                            if (this.boss.vy > 9) this.boss.vy = 9; // Max fall speed lebih pelan
                            this.boss.x += this.boss.vx;
                            this.boss.y += this.boss.vy;
                            
                            let grounded = false;
                    for (const plat of this.level.data.platforms) {
                        if (checkAABB(this.boss, plat) && this.boss.vy > 0) {
                            this.boss.y = plat.y - this.boss.h;
                            this.boss.vy = 0;
                            this.boss.vx = 0; // Berhenti geser waktu mendarat
                            grounded = true;
                        }
                    }
                    
                    if (grounded && this.boss.state === 'ATTACK_ANTIAIR') {
                        this.boss.state = 'RECOVERY_ANTIAIR'; // Sprite mendarat
                        setTimeout(() => {
                            if (this.boss && this.boss.state === 'RECOVERY_ANTIAIR') {
                                this.boss.state = 'IDLE';
                            }
                        }, 300); // Tunggu sebentar baru idle
                    }
                    
                    this.boss.animTimer++;
                }
            }
            this.input.clearJustPressed();
            return;
        }

        this.player.update(this.input, this.level.data.platforms);
        
        // Batas dunia agar tidak terjun bebas ke luar layar (tembok tak terlihat)
        if (this.player.x < 0) {
            this.player.x = 0;
            // Biarkan vx tetap ada agar animasi lari tetap jalan jika user nahan tombol
        }
        if (this.player.x + this.player.w > this.level.data.width) {
            this.player.x = this.level.data.width - this.player.w;
            // Biarkan vx tetap ada agar animasi lari tetap jalan jika user nahan tombol
        }

        this.level.update();

        // Check spawn Boss di level 3 & Syarat Masuk
        if (this.state === STATE.PLAYING && this.level.data.hasBoss && !this.boss && !this.bossDefeated) {
            
            const arenaEntryX = this.level.data.bossArena.x - 20;
            
            // Cek jika player mencoba mendekati area boss
            if (this.player.x >= arenaEntryX) {
                // Syarat: Minimal 5 Kuis Benar ATAU Dev Mode nyala
                if (this.player.quizCorrect < 5) {
                    // MENTOK DINDING!
                    this.player.x = arenaEntryX - 1; 
                    this.ui.showMission("SYARAT KURANG: JAWAB 5 KUIS DENGAN BENAR!");
                } else {
                    // Jeda sebelum teleport
                    this.state = STATE.CUTSCENE; // Pause input
                    this.ui.hideHUD();
                    this.player.vx = 0; // Hentikan player
                    
                    // Dim BGM sedikit duluan
                    this._setBGMVolume(0.1);

                    setTimeout(() => {
                        // TELEPORT KE TENGAH ARENA
                        this.player.x = this.level.data.bossArena.x + 350; // Langsung ke x=3950
                        this.player.y = 380; // Jatuh di tanah
                        this.camera.x = this.level.data.bossArena.x; // Snap kamera
                        
                        // SPAWN SUBO
                        this.boss = new SuboAI(this.level.data.bossArena.x + 650, 380); 
                        this.boss._lastFaceRight = false; // Pastikan dia hadap Galuh
                        
                        // Camera Shake
                        this.shakeTimer = 800; // Getar saat teleport masuk

                        // Dim BGM Lebih parah
                        const bgm = document.getElementById('bgm');
                        this._setBGMVolume(0.05);
                    
                    // Tunggu kamera bergetar selesai, baru masuk VN Dialog
                    setTimeout(() => {
                        this.state = STATE.VN_DIALOG;
                        const dialogs = [
                            { speaker: 'Subo', text: 'Tiba juga kau di sini Galuhhhh... wani karo aku?!!', side: 'right' },
                            { speaker: 'Galuh', text: 'Repak wani, jembar wani. Ayoo tentokke sopo seng tekaning pati!', side: 'left' }
                        ];

                        this.ui.showVNDialog(dialogs, () => {
                            this.state = STATE.BOSS_FIGHT;
                            this._updateBGM();
                            this.ui.showHUD();
                            this.ui.showMission("KALAHKAN SUBO! HP: 300");
                            this._setBGMVolume(0.2);
                        });
                    }, 800); // 800ms tunggu
                    }, 1500); // 1.5 detik tunggu sebelum teleport!
                }
            }
        }

        // Update Boss & Hitstop
        if (this.state === STATE.BOSS_FIGHT && this.boss) {
            // Hitstop hanya mem-pause boss AI, BUKAN collision check
            if (this.hitStopTimer > 0) {
                this.hitStopTimer -= this.fixedDt;
            } else {
                this.boss.update(this.player, this.level.data.platforms);
            }
            
            // Kamera shake trigger explosion dihapus dari sini (sudah global)
            // (Tetapi kalau mau trigger animasi win tetap disini)
            if (this.shakeTimer <= 0 && this.bossDefeated && this.state === STATE.BOSS_FIGHT) {
                // Not needed right now, handled elsewhere maybe? Oh wait, let's just keep the old logic if there was one. Wait, in the original code:
                // Actually the original code just did `this.shakeTimer -= this.fixedDt;` here. Let's just remove the internal decrement.
            }

            // Kunci kamera di arena boss
            const arena = this.level.data.bossArena;
            this.camera.x = arena.x;
            if (this.player.x < arena.x) this.player.x = arena.x;
            if (this.player.x > arena.x + arena.width - this.player.w) this.player.x = arena.x + arena.width - this.player.w;
            
            // Update UI HP Boss
            this.ui.elements.missionText.textContent = `KALAHKAN SUBO! HP: ${this.boss.hp}`;

            // Player menyerang boss
            if (this.player.attackHitbox && checkAABB(this.player.attackHitbox, this.boss)) {
                // Jangan double hit per attack
                if (!this.player.attackHitbox.hasHit) {
                    this.player.attackHitbox.hasHit = true; // flag agar tak multiple hit
                    let isFrontal = (this.player.facingRight && this.boss.x > this.player.x) || (!this.player.facingRight && this.boss.x < this.player.x);
                    
                    let dmgResult = this.boss.takeDamage(this.player.attackHitbox.damage, isFrontal, this.player.attackHitbox.isHeavy, this.player.x);
                    
                    if (dmgResult === 'DEFLECT') {
                        this.hitStopTimer = 80;
                        this.player.vx = this.player.facingRight ? -300 : 300; // Knockback besar
                        this.floatingTexts.push({ x: this.boss.x + this.boss.w/2, y: this.boss.y + 50, text: "BLOCKED", color: '#cccccc', timer: 80, vy: -0.5 });
                    } else if (dmgResult === true) {
                        this.hitStopTimer = this.player.attackHitbox.isHeavy ? 100 : 30;
                        this.shakeTimer = this.player.attackHitbox.isHeavy ? 150 : 0;
                        this.floatingTexts.push({ x: this.boss.x + this.boss.w/2, y: this.boss.y + 50 + (Math.random() * 20 - 10), text: "-" + this.player.attackHitbox.damage, color: '#ffffff', timer: 80, vy: -1 });
                    }
                }
            }
            
            if (this.boss && this.boss.state === 'DEAD') {
                this.boss = null;
                this.bossDefeated = true;
                this.state = STATE.PLAYING;
                this.player.score += 2000;
                this._updateBGM(); // Kembali ke BGM normal
            } else if (this.boss && this.boss.state !== 'DYING') {
                // Boss menyerang player — SELALU dicek setiap frame
                let bossBoxes = this.boss.getHitboxes();
                
                if (!this.player.isInvulnerable && this.player.alive) {
                    for (let box of bossBoxes) {
                        if (checkAABB(this.player, box)) {

                            
                            this.player.hp -= 10; // 10 hits to die (dikurangi dari 15 per hit)
                            this.player.isInvulnerable = true;
                            this.player.hurtTimer = 30; // 30 frame hurt animation
                            
                            this.floatingTexts.push({ x: this.player.x + this.player.w/2, y: this.player.y - 10, text: "-10", color: '#ff4444', timer: 80, vy: -1 });
                            
                            // Efek Knockback yang kuat agar terasa impactnya
                            this.player.vy = -12;  
                            // Terpental berlawanan dari posisi hitbox
                            this.player.vx = (this.player.x < box.x) ? -15 : 15; 
                            
                            // Reset invulnerable after 1s menggunakan frame counter
                            this.player._invulTimer = 60; // 60 frames = 1 second
                            
                            this.hitStopTimer = 15;
                            
                            if (this.player.hp <= 0) {
                                this._triggerGameOver("Dihancurkan oleh Subo!", 4000);
                                return;
                            }
                            break; // Hanya kena 1 box per frame
                        }
                    }
                }
            }
        }

    // Hapus duplikasi cek mati di update() karena sudah ditangani oleh _handleEvents()


        if (this.state === STATE.PLAYING) {
            this._nearNPC = null; // HARUS di-reset setiap frame sebelum dicek ulang
            const events = this.level.checkInteractions(this.player);
            this._handleEvents(events);
        }

        // Tampilkan prompt hanya jika benar-benar dekat NPC dan state valid
        if (this._nearNPC && !this._nearNPC.quizDone && this.state !== STATE.BOSS_FIGHT) {
            this.ui.showNPCPrompt();
            if (this.input.isJustPressed('KeyE')) {
                this._startQuiz(this._nearNPC);
            }
        } else {
            this.ui.hideNPCPrompt();
        }

        if (this.state !== STATE.BOSS_FIGHT) {
            this.camera.follow(this.player, this.level.data.width);
        }

        this.ui.updateHUD(
            this.player.score, 
            this.player.barsCollected, 
            this.level.data.requiredBars,
            this.currentLevel,
            this.player.hp,
            this.boss ? this.boss.hp : -1,
            this.boss ? this.boss.maxHp : 4000
        );

        // Update floating texts
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            let ft = this.floatingTexts[i];
            ft.y += ft.vy;
            ft.timer--;
            if (ft.timer <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }

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
                    this._triggerGameOver("Tersengat Listrik!");
                    break;
                    
                case 'fell_off':
                    this._triggerGameOver("Jatuh ke Jurang!");
                    return;

                case 'near_npc':
                    this._nearNPC = event.data;
                    break;

                case 'reach_finish':
                    if (this.currentLevel < 3) {
                        this.player.score += 300; // Bonus stage clear
                        this._unlockNextLevel(this.currentLevel + 1);
                        this.startGame(this.currentLevel + 1);
                    } else {
                        // Level 3: Hanya bisa finish setelah boss dikalahkan
                        if (this.bossDefeated) {
                            this.state = STATE.WIN;
                            this.ui.showWin(this.player, this.level.data.requiredBars);
                        }
                        // Jika boss belum dikalahkan, abaikan finish gate
                    }
                    return;
            }
        }
    }

    _unlockNextLevel(levelNumber) {
        if (levelNumber > this.unlockedLevel) {
            this.unlockedLevel = levelNumber;
            localStorage.setItem('argentara_unlocked_level', this.unlockedLevel.toString());
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

    _triggerGameOver(reason, delay = 1500) { // Beri jeda sebelum layar game over muncul agar animasi mati terlihat
        if (this._isGameOverPending) return;
        this._isGameOverPending = true;
        this.player.alive = false;
        this.player.animTimer = 0; // RESET timer animasi agar mulai dari frame jatuh
        
        // Bad Ending Logic
        if (this.currentLevel === 3) {
            reason = "Pasar telah runtuh, Galuh! - Subo";
            this.player.barsCollected = 0;
            this.player.score = 0;
        }

        setTimeout(() => {
            this.state = STATE.GAME_OVER;
            this.ui.showGameOver(this.player.score, reason);
            this._saveHighScore(this.player.score);
            this.currentLevel = 1;
            this._isGameOverPending = false;
        }, delay);
    }

    draw() { // render semua grafik ke canvas
        const ctx = this.ctx;
        const camX = this.camera.x;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.state === STATE.MENU) {
            this.level.draw(ctx, 0, this.canvas.width, this.canvas.height);
            return;
        }

        ctx.save();
        ctx.translate(0, -35);
        if (this.shakeTimer > 0) {
            const mag = 4;
            const rx = (Math.random() - 0.5) * mag;
            const ry = (Math.random() - 0.5) * mag;
            ctx.translate(rx, ry);
        }

        this.level.draw(ctx, camX, this.canvas.width, this.canvas.height);

        if ((this.state === STATE.BOSS_FIGHT || this.state === STATE.CUTSCENE || this.state === STATE.VN_DIALOG) && this.boss) {
            this.boss.draw(ctx, camX);
        }

        if (this.state !== STATE.MAIN_MENU && this.state !== STATE.LEVEL_TRANSITION && this.state !== STATE.VICTORY) {
            this.player.draw(ctx, camX);
        }

        // Gambar floating texts
        if (this.floatingTexts && this.floatingTexts.length > 0) {
            ctx.font = "bold 24px 'Courier New', monospace";
            ctx.textAlign = "center";
            for (let ft of this.floatingTexts) {
                ctx.globalAlpha = Math.max(0, ft.timer / 80);
                // Outline/shadow
                ctx.fillStyle = "#000000";
                ctx.fillText(ft.text, ft.x - camX + 2, ft.y + 2);
                ctx.fillText(ft.text, ft.x - camX - 2, ft.y - 2);
                // Teks asli
                ctx.fillStyle = ft.color;
                ctx.fillText(ft.text, ft.x - camX, ft.y);
            }
            ctx.globalAlpha = 1.0;
        }

        ctx.restore();

        if (this.state === STATE.WARTA || this.state === STATE.QUIZ) {

        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new Game();
});
