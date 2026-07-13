

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

    destroy() {
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('keyup', this._onKeyUp);
    }
}
