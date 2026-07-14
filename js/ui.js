

export class UIManager { // class untuk mengatur interaksi DOM dan HTML UI
    constructor() {

        this.elements = { // cache referensi elemen DOM
            menuScreen: document.getElementById('menu-screen'),
            aboutModal: document.getElementById('about-modal'),
            gameoverScreen: document.getElementById('gameover-screen'),
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

            gameWrapper: document.getElementById('game-wrapper'),
        };

        this._bindButtons();

        this._onStartGame = null;
        this._onRetry = null;
        this._onBackToMenu = null;
    }

    _bindButtons() { // pasang event listener ke semua tombol UI

        document.getElementById('btn-start').addEventListener('click', () => {
            const bgm = document.getElementById('bgm');
            if (bgm) {
                bgm.volume = 0.4; // Atur volume agar tidak terlalu berisik
                bgm.play().catch(e => console.log("Audio play diizinkan setelah interaksi"));
            }
            if (this._onStartGame) this._onStartGame();
        });

        document.getElementById('btn-about').addEventListener('click', () => {
            this.elements.menuScreen.classList.add('hidden');
            this.elements.aboutModal.classList.remove('hidden');
        });

        document.getElementById('btn-close-about').addEventListener('click', () => {
            this.elements.aboutModal.classList.add('hidden');
            this.elements.menuScreen.classList.remove('hidden');
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

    showHUD() {
        this.elements.hud.classList.remove('hidden');
    }

    hideHUD() {
        this.elements.hud.classList.add('hidden');
    }

    updateHUD(score, bars, totalBars, currentLevel) { // update text di pojok kiri atas
        this.elements.scoreValue.textContent = score;
        this.elements.barsValue.textContent = `${bars} / ${totalBars}`;
        if (this.elements.levelValue && currentLevel) {
            this.elements.levelValue.textContent = `Level ${currentLevel}`;
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

    showGameOver(score) {
        this.elements.gameoverScoreValue.textContent = score;
        this.elements.gameoverScreen.classList.remove('hidden');
    }

    hideGameOver() {
        this.elements.gameoverScreen.classList.add('hidden');
    }

    showWin(score, barsCollected, totalBars) { // hitung bintang dan tampilkan menu menang
        this.elements.winScoreValue.textContent = score;

        let stars = 1;
        if (barsCollected >= totalBars) stars = 2;
        if (barsCollected >= totalBars && score >= 500) stars = 3;

        const starText = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
        this.elements.winStars.textContent = starText;

        this.elements.winScreen.classList.remove('hidden');
    }

    hideWin() {
        this.elements.winScreen.classList.add('hidden');
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
}
