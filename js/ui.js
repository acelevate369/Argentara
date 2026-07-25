

export class UIManager { // class untuk mengatur interaksi DOM dan HTML UI
    constructor() {

        this.elements = { // cache referensi elemen DOM
            menuScreen: document.getElementById('menu-screen'),
            aboutModal: document.getElementById('about-modal'),
            levelMenuScreen: document.getElementById('level-menu-screen'),
            pauseScreen: document.getElementById('pause-screen'),
            gameoverScreen: document.getElementById('gameover-screen'),
            gameoverReason: document.getElementById('gameover-reason'),
            winScreen: document.getElementById('win-screen'),

            hud: document.getElementById('hud'),
            levelValue: document.getElementById('level-value'),
            scoreValue: document.getElementById('score-value'),
            barsValue: document.getElementById('bars-value'),
            gravityArrow: document.getElementById('gravity-arrow'),

            missionBanner: document.getElementById('mission-banner'),
            missionText: document.getElementById('mission-text'),

            npcPrompt: document.getElementById('npc-prompt'),

            wartaPopup: document.getElementById('warta-popup'),
            wartaText: document.getElementById('warta-text'),

            quizModal: document.getElementById('quiz-modal'),
            quizNpcName: document.querySelector('.quiz-npc-label span:last-child'),
            quizQuestion: document.getElementById('quiz-question'),
            quizOptions: document.getElementById('quiz-options'),
            quizFeedback: document.getElementById('quiz-feedback'),
            quizFeedbackText: document.getElementById('quiz-feedback-text'),

            gameoverScoreValue: document.getElementById('gameover-score-value'),
            winScoreValue: document.getElementById('win-score-value'),
            winStars: document.getElementById('win-stars'),
            winTrueMessage: document.getElementById('win-true-message'),

            vnDialogScreen: document.getElementById('vn-dialog-screen'),
            vnPortraitLeft: document.getElementById('vn-portrait-left'),
            vnPortraitRight: document.getElementById('vn-portrait-right'),
            vnSpeakerName: document.getElementById('vn-speaker-name'),
            vnDialogText: document.getElementById('vn-dialog-text'),

            gameWrapper: document.getElementById('game-wrapper'),
        };

        this._bindButtons();

        this._onStartGame = null;
        this._onRetry = null;
        this._onBackToMenu = null;
        this._onSelectLevel = null;
        this._onResume = null;
        this._onPauseMenu = null;

        this._setupKeyboardNavigation();
    }

    _setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (!this.elements.vnDialogScreen.classList.contains('hidden')) {
                    if (this._onVNDialogNext) this._onVNDialogNext();
                } else if (!this.elements.wartaPopup.classList.contains('hidden')) {
                    document.getElementById('btn-close-warta').click();
                } else if (!this.elements.quizFeedback.classList.contains('hidden')) {
                    document.getElementById('btn-quiz-continue').click();
                } else if (!this.elements.menuScreen.classList.contains('hidden')) {
                    document.getElementById('btn-start').click();
                } else if (!this.elements.gameoverScreen.classList.contains('hidden')) {
                    document.getElementById('btn-retry').click();
                } else if (!this.elements.winScreen.classList.contains('hidden')) {
                    document.getElementById('btn-replay').click();
                } else if (!this.elements.pauseScreen.classList.contains('hidden')) {
                    document.getElementById('btn-resume').click();
                }
            }
        });
    }

    _bindButtons() { // pasang event listener ke semua tombol UI
        
        // Workaround browser autoplay policy: play audio on first user interaction anywhere
        document.body.addEventListener('click', () => {
            const bgm = document.getElementById('bgm');
            if (bgm && bgm.paused) {
                bgm.volume = 0.2;
                bgm.play().catch(e => {});
            }
        }, { once: true });

        document.getElementById('btn-start').addEventListener('click', () => {
            const bgm = document.getElementById('bgm');
            if (bgm) {
                bgm.volume = 0.2; // Sesuai request: 20% agar tidak mengganggu
                bgm.play().catch(e => console.log("Audio play diizinkan setelah interaksi"));
            }
            if (this._onStartGame) this._onStartGame();
        });

        this.elements.vnDialogScreen.addEventListener('click', () => {
            if (this._onVNDialogNext) this._onVNDialogNext();
        });

        let aboutSource = 'menu';

        document.getElementById('btn-about').addEventListener('click', () => {
            aboutSource = 'menu';
            this.elements.menuScreen.classList.add('hidden');
            this.elements.aboutModal.classList.remove('hidden');
        });
        
        document.getElementById('btn-pause-about').addEventListener('click', () => {
            aboutSource = 'pause';
            this.elements.pauseScreen.classList.add('hidden');
            this.elements.aboutModal.classList.remove('hidden');
        });

        document.getElementById('btn-close-about').addEventListener('click', () => {
            this.elements.aboutModal.classList.add('hidden');
            if (aboutSource === 'menu') {
                this.elements.menuScreen.classList.remove('hidden');
            } else {
                this.elements.pauseScreen.classList.remove('hidden');
            }
        });

        let settingsSource = 'menu';

        document.getElementById('btn-settings').addEventListener('click', () => {
            settingsSource = 'menu';
            this.elements.menuScreen.classList.add('hidden');
            document.getElementById('settings-modal').classList.remove('hidden');
        });
        
        document.getElementById('btn-pause-settings').addEventListener('click', () => {
            settingsSource = 'pause';
            this.elements.pauseScreen.classList.add('hidden');
            document.getElementById('settings-modal').classList.remove('hidden');
        });

        document.getElementById('btn-close-settings').addEventListener('click', () => {
            document.getElementById('settings-modal').classList.add('hidden');
            if (settingsSource === 'menu') {
                this.elements.menuScreen.classList.remove('hidden');
            } else {
                this.elements.pauseScreen.classList.remove('hidden');
            }
        });

        const bgmSlider = document.getElementById('bgm-slider');
        const sfxSlider = document.getElementById('sfx-slider');
        const bgmVal = document.getElementById('bgm-val');
        const sfxVal = document.getElementById('sfx-val');

        bgmSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            bgmVal.textContent = Math.round(val * 100) + '%';
            window.gameSettings.bgmVolume = val;
            const bgm = document.getElementById('bgm');
            if (bgm) bgm.volume = window.gameSettings.bgmBase * val;
        });

        sfxSlider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            sfxVal.textContent = Math.round(val * 100) + '%';
            window.gameSettings.sfxVolume = val;
        });



        const btnLevelMenu = document.getElementById('btn-level-menu');
        if (btnLevelMenu) {
            btnLevelMenu.addEventListener('click', () => {
                this.elements.menuScreen.classList.add('hidden');
                if (this._onSelectLevel) this._onSelectLevel('show'); // delegate to main to update unlocked states
            });
        }

        const btnCloseLevelMenu = document.getElementById('btn-close-level-menu');
        if (btnCloseLevelMenu) {
            btnCloseLevelMenu.addEventListener('click', () => {
                this.elements.levelMenuScreen.classList.add('hidden');
                this.elements.menuScreen.classList.remove('hidden');
            });
        }
        
        document.getElementById('btn-resume').addEventListener('click', () => {
            if (this._onResume) this._onResume();
        });
        
        document.getElementById('btn-pause-menu').addEventListener('click', () => {
            if (this._onPauseMenu) this._onPauseMenu();
        });

        // Event listener level buttons
        document.querySelectorAll('.btn-level').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.currentTarget;
                // Jika tombol terkunci dan Dev Mode tidak aktif, jangan proses
                // Cek sebenarnya ada di callback main.js (onSelectLevel), jadi langsung teruskan saja
                if (button.classList.contains('btn-locked')) return;
                
                const levelNum = parseInt(button.dataset.level);
                this.elements.levelMenuScreen.classList.add('hidden');
                if (this._onSelectLevel) this._onSelectLevel('start', levelNum);
            });
        });

        document.getElementById('btn-close-warta').addEventListener('click', () => {
            this.hideWarta();
            if (this._wartaCallback) {
                this._wartaCallback();
                this._wartaCallback = null;
            }
        });

        document.getElementById('btn-quiz-continue').addEventListener('click', () => {
            this.hideQuiz();
            if (this._quizCallback) {
                this._quizCallback(this._quizResult);
                this._quizCallback = null;
            }
        });

        document.getElementById('btn-retry').addEventListener('click', () => {
            this.hideGameOver();
            if (this._onRetry) this._onRetry();
        });

        document.getElementById('btn-menu-from-gameover').addEventListener('click', () => {
            this.hideGameOver();
            if (this._onBackToMenu) this._onBackToMenu();
        });

        document.getElementById('btn-replay').addEventListener('click', () => {
            this.hideWin();
            if (this._onRetry) this._onRetry();
        });

        document.getElementById('btn-menu-from-win').addEventListener('click', () => {
            this.hideWin();
            if (this._onBackToMenu) this._onBackToMenu();
        });
    }

    showMenu() {
        this.elements.menuScreen.classList.remove('hidden');
        this.elements.hud.classList.add('hidden');
        this.elements.missionBanner.classList.add('hidden');
    }

    hideMenu() {
        this.elements.menuScreen.classList.add('hidden');
    }

    showVNDialog(dialogs, onComplete) {
        this.elements.vnDialogScreen.classList.remove('hidden');
        let currentIdx = 0;
        
        const renderDialog = () => {
            if (currentIdx >= dialogs.length) {
                this.elements.vnDialogScreen.classList.add('hidden');
                this._onVNDialogNext = null;
                if (onComplete) onComplete();
                return;
            }
            
            const step = dialogs[currentIdx];
            this.elements.vnSpeakerName.textContent = step.speaker;
            this.elements.vnDialogText.textContent = step.text;
            
            if (step.side === 'right') {
                this.elements.vnPortraitRight.classList.remove('hidden');
                this.elements.vnPortraitRight.classList.remove('inactive');
                this.elements.vnPortraitLeft.classList.add('inactive');
                this.elements.vnSpeakerName.classList.add('speaker-right');
            } else {
                this.elements.vnPortraitLeft.classList.remove('hidden');
                this.elements.vnPortraitLeft.classList.remove('inactive');
                this.elements.vnPortraitRight.classList.add('inactive');
                this.elements.vnSpeakerName.classList.remove('speaker-right');
            }
            
            if (step.action === 'jump-out') {
                this.elements.vnPortraitRight.classList.add('jump-out');
            }
        };
        
        this._onVNDialogNext = () => {
            currentIdx++;
            renderDialog();
        };
        
        // Reset state
        this.elements.vnPortraitLeft.classList.add('hidden', 'inactive');
        this.elements.vnPortraitRight.classList.add('hidden', 'inactive');
        this.elements.vnPortraitRight.classList.remove('jump-out');
        
        renderDialog();
    }

    showHUD() {
        this.elements.hud.classList.remove('hidden');
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            const mobileControls = document.getElementById('mobile-controls');
            if (mobileControls) mobileControls.classList.remove('hidden');
        }
    }

    hideHUD() {
        this.elements.hud.classList.add('hidden');
        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) mobileControls.classList.add('hidden');
    }

    updateHUD(score, bars, totalBars, currentLevel, playerHp = 100, bossHp = -1, bossMaxHp = 4000) { // update text di pojok kiri atas
        this.elements.scoreValue.textContent = score;
        this.elements.barsValue.textContent = `${bars} / ${totalBars}`;
        if (this.elements.levelValue && currentLevel) {
            this.elements.levelValue.textContent = `Level ${currentLevel}`;
        }
        
        const hudPlayerHp = document.getElementById('hud-player-hp');
        const playerHpBar = document.getElementById('player-hp-bar');
        if (hudPlayerHp) {
            if (bossHp >= 0) {
                hudPlayerHp.classList.remove('hidden');
                hudPlayerHp.style.display = 'flex';
                if (playerHpBar) playerHpBar.style.width = Math.max(0, playerHp) + '%';
            } else {
                hudPlayerHp.classList.add('hidden');
                hudPlayerHp.style.display = 'none';
            }
        }

        const hudBossHp = document.getElementById('hud-boss-hp');
        const bossHpBar = document.getElementById('boss-hp-bar');
        if (hudBossHp) {
            if (currentLevel === 3 && bossHp >= 0) {
                hudBossHp.classList.remove('hidden');
                hudBossHp.style.display = 'flex';
                if (bossHpBar) bossHpBar.style.width = Math.max(0, (bossHp / bossMaxHp) * 100) + '%';
            } else {
                hudBossHp.classList.add('hidden');
                hudBossHp.style.display = 'none';
            }
        }
    }

    showMission(text) {
        this.elements.missionText.textContent = text;
        this.elements.missionBanner.classList.remove('hidden');

        this.elements.missionBanner.style.animation = 'none';

        void this.elements.missionBanner.offsetHeight;
        this.elements.missionBanner.style.animation = '';

        clearTimeout(this._missionTimeout);
        this._missionTimeout = setTimeout(() => {
            this.elements.missionBanner.classList.add('hidden');
        }, 5000);
    }

    showNPCPrompt() {
        this.elements.npcPrompt.classList.remove('hidden');
    }

    hideNPCPrompt() {
        this.elements.npcPrompt.classList.add('hidden');
    }

    showWarta(factText, callback) { // tampilkan popup fakta saat ambil bintang warta
        this.elements.wartaText.textContent = factText;
        this.elements.wartaPopup.classList.remove('hidden');
        this._wartaCallback = callback;
    }

    hideWarta() {
        this.elements.wartaPopup.classList.add('hidden');
    }

    showQuiz(quizData, callback) { // generate tombol kuis dinamis dari data
        this._quizCallback = callback;
        this._quizResult = false;

        // Variasi nama NPC
        if (this.elements.quizNpcName) {
            this.elements.quizNpcName.textContent = Math.random() > 0.5 ? 'Cak Sura' : 'Cak Baya';
        }

        this.elements.quizQuestion.textContent = quizData.question;

        this.elements.quizOptions.innerHTML = '';
        this.elements.quizFeedback.classList.add('hidden');

        quizData.options.forEach((optText, index) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = optText;
            btn.addEventListener('click', () => {
                this._handleQuizAnswer(index, quizData);
            });
            this.elements.quizOptions.appendChild(btn);
        });

        this.elements.quizModal.classList.remove('hidden');
    }

    _handleQuizAnswer(selectedIndex, quizData) { // validasi jawaban kuis
        const buttons = this.elements.quizOptions.querySelectorAll('.quiz-option-btn');

        buttons.forEach(btn => btn.classList.add('disabled'));

        if (selectedIndex === quizData.correctIndex) {
            buttons[selectedIndex].classList.add('correct');
            this._quizResult = true;
            this.elements.quizFeedbackText.textContent = 
                '✅ ' + quizData.explanation;
            this.elements.quizFeedbackText.style.color = '#3cdc7c';
        } else {
            buttons[selectedIndex].classList.add('wrong');
            buttons[quizData.correctIndex].classList.add('correct');
            this._quizResult = false;
            this.elements.quizFeedbackText.textContent = 
                '❌ Jawaban salah. ' + quizData.explanation;
            this.elements.quizFeedbackText.style.color = '#ff6677';
        }

        this.elements.quizFeedback.classList.remove('hidden');
    }

    hideQuiz() {
        this.elements.quizModal.classList.add('hidden');
    }

    showGameOver(score, reason = 'Analisis Gagal!') {
        this.elements.gameoverReason.textContent = reason;
        this.elements.gameoverScoreValue.textContent = score;
        this.elements.gameoverScreen.classList.remove('hidden');
    }

    hideGameOver() {
        this.elements.gameoverScreen.classList.add('hidden');
    }

    showWin(player, totalBars) { // hitung bintang dan tampilkan menu menang
        this.elements.winScoreValue.textContent = player.score;

        let stars = 1;
        let percentSilver = totalBars === 0 ? 1 : Math.min(1, player.barsCollected / totalBars);
        
        if (percentSilver > 0.5) stars++; // 2 bintang
        if (percentSilver >= 1) stars++; // 3 bintang
        if (player.quizCorrect >= 3) stars++; // 4 bintang
        if (player.quizCorrect >= 5 && percentSilver >= 1) stars++;
        const starSVG = `<svg width="32" height="32" viewBox="0 0 20 20"><polygon points="10,1 12.7,6.5 19,7.4 14.5,11.8 15.5,18 10,15.1 4.5,18 5.5,11.8 1,7.4 7.3,6.5" fill="#ffd700"/></svg>`;
        const emptyStarSVG = `<svg width="32" height="32" viewBox="0 0 20 20"><polygon points="10,1 12.7,6.5 19,7.4 14.5,11.8 15.5,18 10,15.1 4.5,18 5.5,11.8 1,7.4 7.3,6.5" fill="#556677"/></svg>`;        
        
        let starHtml = '';
        for (let i = 0; i < 5; i++) {
            starHtml += (i < stars) ? starSVG : emptyStarSVG;
        }
        
        this.elements.winStars.innerHTML = starHtml;

        this.elements.winScreen.classList.remove('hidden');
    }

    hideWin() {
        this.elements.winScreen.classList.add('hidden');
    }
    
    showPause() {
        this.elements.pauseScreen.classList.remove('hidden');
    }
    
    hidePause() {
        this.elements.pauseScreen.classList.add('hidden');
    }

    flashGravityEffect() {
        this.elements.gameWrapper.classList.add('gravity-flip');
        setTimeout(() => {
            this.elements.gameWrapper.classList.remove('gravity-flip');
        }, 300);
    }

    onStartGame(cb) { this._onStartGame = cb; }
    onRetry(cb) { this._onRetry = cb; }
    onBackToMenu(cb) { this._onBackToMenu = cb; }
    onSelectLevel(cb) { this._onSelectLevel = cb; }
    onResume(cb) { this._onResume = cb; }
    onPauseMenu(cb) { this._onPauseMenu = cb; }
}
