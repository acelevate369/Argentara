

import { 
    GRAVITY, MAX_FALL_SPEED, JUMP_FORCE, MOVE_SPEED, FRICTION,
    resolveCollisions 
} from './physics.js';

export class Player { // class entitas utama yang dikendalikan pemain
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.name = "Galuh";
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
        
        // Mekanik Tempur
        this.isAttacking = false;
        this.attackTimer = 0;
        this.attackHitbox = null;
        
        this.isDashing = false;
        this.dashTimer = 0;
        this.isInvulnerable = false;
        
        this.isHeavyAttacking = false;
        this.heavyTimer = 0;
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

        // Update Combat Timers
        if (this.isAttacking) {
            this.attackTimer--;
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
                this.attackHitbox = null;
            }
        }
        
        if (this.isDashing) {
            this.dashTimer--;
            this.vx = this.facingRight ? 8 : -8; // Kecepatan dash
            this.vy = 0; // Freeze gravity during dash
            if (this.dashTimer <= 0) {
                this.isDashing = false;
                this.isInvulnerable = false;
            }
        }
        
        if (this.isHeavyAttacking) {
            this.heavyTimer--;
            this.vx = 0; // Stop moving
            if (this.heavyTimer <= 0) {
                this.isHeavyAttacking = false;
                this.attackHitbox = null;
            }
        }

        // Combat Inputs
        if (!this.isDashing && !this.isHeavyAttacking && !this.isAttacking) {
            if (input.isJustPressed('KeyJ')) { // Sabetan Warta
                this.isAttacking = true;
                this.attackTimer = 15; // frames (approx 250ms)
                this._createHitbox(40, 20, 10);
            } else if (input.isJustPressed('ShiftLeft') && this.score >= 20) { // Dash
                this.score -= 20;
                this.isDashing = true;
                this.isInvulnerable = true;
                this.dashTimer = 10; // frames
            } else if (input.isJustPressed('KeyK') && this.score >= 50) { // Heavy Attack
                this.score -= 50;
                this.isHeavyAttacking = true;
                this.heavyTimer = 30; // frames
                this._createHitbox(80, 20, 40, true);
            }
        }

        resolveCollisions(this, platforms); // panggil engine fisika AABB

        if (this.grounded) {
            this.jumpCount = 0; // reset jatah lompat
        }
        this.animTimer++;
    }

    _createHitbox(w, h, damage, isHeavy = false) {
        const offset = this.facingRight ? this.w : -w;
        this.attackHitbox = {
            x: this.x + offset,
            y: this.y + (this.h - h) / 2,
            w: w,
            h: h,
            damage: damage,
            isHeavy: isHeavy
        };
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

        if (this.isInvulnerable) {
            // Aura dash
            ctx.fillStyle = 'rgba(60, 220, 124, 0.5)';
            ctx.fillRect(drawX - 5, drawY - 5, this.w + 10, this.h + 10);
        }

        if (this.isHeavyAttacking) {
            ctx.fillStyle = '#ffaa00';
            ctx.fillRect(drawX, drawY, this.w, this.h); // visual feedback
        }

        ctx.restore();
        
        // Gambar Attack Hitbox untuk debug/visual
        if (this.attackHitbox) {
            const hx = this.attackHitbox.x - camX;
            const hy = this.attackHitbox.y;
            ctx.fillStyle = this.attackHitbox.isHeavy ? 'rgba(255, 68, 85, 0.7)' : 'rgba(255, 255, 255, 0.7)';
            ctx.fillRect(hx, hy, this.attackHitbox.w, this.attackHitbox.h);
        }
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
        // this.score = 0; // Score tidak di-reset otomatis agar terbawa ke level selanjutnya
        this.barsCollected = 0;
        this.quizCorrect = 0;
        this.jumpCount = 0;
        this.animTimer = 0;
    }
}
