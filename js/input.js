

export class InputHandler { // handler untuk input keyboard
    constructor() {
        this.keys = {}; // state tombol yang sedang ditekan
        
        this.justPressed = {}; // state tombol yang baru ditekan di frame ini

        this.gameKeys = [ // daftar tombol yang default browser action-nya akan diblokir
            'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
            'Space', 'KeyG', 'ShiftLeft', 'ShiftRight',
            'KeyA', 'KeyD', 'KeyW', 'KeyS', 'KeyE'
        ];

        this._onKeyDown = this._onKeyDown.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);

        window.addEventListener('keydown', this._onKeyDown);
        window.addEventListener('keyup', this._onKeyUp);
    }

    _onKeyDown(e) { // dipanggil saat tombol ditekan

        if (!this.keys[e.code]) {
            this.justPressed[e.code] = true; // catat jika baru ditekan
        }
        this.keys[e.code] = true;

        if (this.gameKeys.includes(e.code)) {
            e.preventDefault(); // cegah scrolling dll
        }
    }

    _onKeyUp(e) { // dipanggil saat tombol dilepas
        this.keys[e.code] = false; // set false
    }

    isPressed(code) { // cek apakah tombol sedang ditahan
        return !!this.keys[code];
    }

    isJustPressed(code) { // cek apakah tombol baru ditekan frame ini
        return !!this.justPressed[code];
    }

    clearJustPressed() { // bersihkan state justPressed di akhir frame
        this.justPressed = {};
    }

    setupTouchControls() {
        const touchBtns = document.querySelectorAll('.touch-btn');
        
        touchBtns.forEach(btn => {
            const keyCode = btn.getAttribute('data-key');
            
            // Prevent default behavior (like zooming, scrolling, or emulating mouse events)
            const handleTouch = (e) => {
                e.preventDefault(); 
            };

            btn.addEventListener('touchstart', (e) => {
                e.preventDefault(); // Mencegah double-fire dari emulated mouse events
                btn.classList.add('active'); // Manual visual feedback
                
                if (!this.keys[keyCode]) {
                    this.justPressed[keyCode] = true;
                }
                this.keys[keyCode] = true;
            }, { passive: false });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                btn.classList.remove('active');
                this.keys[keyCode] = false;
            }, { passive: false });

            btn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                btn.classList.remove('active');
                this.keys[keyCode] = false;
            }, { passive: false });
        });
    }

    destroy() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
    }
}
