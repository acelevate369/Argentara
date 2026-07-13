

import { 
    GRAVITY, MAX_FALL_SPEED, JUMP_FORCE, MOVE_SPEED, FRICTION,
    resolveCollisions 
} from './physics.js';

export class Player { // class entitas utama yang dikendalikan pemain
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 24; // lebar hitbox
        this.h = 32; // tinggi hitbox

        this.vx = 0; // kecepatan sumbu X
        this.vy = 0; // kecepatan sumbu Y

        this.gravityDir = 1;

        this.grounded = false;
        this.facingRight = true;
        this.alive = true;

        this.score = 0;
        this.barsCollected = 0;
        this.quizCorrect = 0;

        this.spawnX = x;
        this.spawnY = y;

        this.jumpCount = 0;

        this.animTimer = 0;
    }

    update(input, platforms) { // proses fisika dan input tiap frame
        if (!this.alive) return;

        if (input.isPressed('ArrowLeft') || input.isPressed('KeyA')) {
            this.vx = -MOVE_SPEED;
            this.facingRight = false;
        } else if (input.isPressed('ArrowRight') || input.isPressed('KeyD')) {
            this.vx = MOVE_SPEED;
            this.facingRight = true;
        } else {
            this.vx *= FRICTION; // pelan-pelan berhenti jika ga ada input
            if (Math.abs(this.vx) < 0.1) this.vx = 0;
        }

        const jumpPressed = input.isJustPressed('Space') || 
                           input.isJustPressed('ArrowUp') || 
                           input.isJustPressed('KeyW');
        if (jumpPressed) {
            if (this.grounded) {
                this.vy = -JUMP_FORCE; // lompatan dari tanah
                this.grounded = false;
                this.jumpCount = 1;
            } else if (this.jumpCount < 2) {
                this.vy = -JUMP_FORCE * 0.8; // double jump di udara
                this.jumpCount = 2;
            }
        }

        this.vy += GRAVITY;

        this.vy = Math.min(this.vy, MAX_FALL_SPEED);

        resolveCollisions(this, platforms); // panggil engine fisika AABB

        if (this.grounded) {
            this.jumpCount = 0; // reset jatah lompat
        }
        this.animTimer++;
    }

    draw(ctx, camX) { // render kotak karakter ke canvas
        const drawX = this.x - camX;
        const drawY = this.y;

        ctx.save();

        ctx.fillStyle = '#2ecc71';
        ctx.fillRect(drawX, drawY, this.w, this.h);

        ctx.fillStyle = '#1a8a4a';
        ctx.fillRect(drawX + 2, drawY, this.w - 4, 10);

        ctx.fillStyle = '#ffffff';
        const eyeX = this.facingRight ? drawX + this.w - 10 : drawX + 4;
        ctx.fillRect(eyeX, drawY + 4, 6, 4);

        ctx.fillStyle = '#0a1a2a';
        const pupilX = this.facingRight ? eyeX + 3 : eyeX + 1;
        ctx.fillRect(pupilX, drawY + 5, 2, 2);

        ctx.fillStyle = '#c0c8d4';
        ctx.fillRect(drawX + 4, drawY + 18, this.w - 8, 3);

        if (!this.grounded && this.jumpCount >= 2) {
            ctx.globalAlpha = 0.4 + Math.sin(this.animTimer * 0.2) * 0.3;
            ctx.strokeStyle = '#3cdc7c';
            ctx.lineWidth = 2;
            ctx.strokeRect(drawX - 2, drawY - 2, this.w + 4, this.h + 4);
            ctx.globalAlpha = 1;
        }

        ctx.restore();
    }

    reset() { // kembalikan ke titik awal saat retry / mulai baru
        this.x = this.spawnX;
        this.y = this.spawnY;
        this.vx = 0;
        this.vy = 0;
        this.gravityDir = 1;
        this.grounded = false;
        this.facingRight = true;
        this.alive = true;
        this.score = 0;
        this.barsCollected = 0;
        this.quizCorrect = 0;
        this.jumpCount = 0;
        this.animTimer = 0;
    }
}
