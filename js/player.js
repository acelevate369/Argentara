

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
        
        this.hp = 100;
        this.maxHp = 100;

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
        this.hurtTimer = 0; // Timer untuk animasi hurt
        this._invulTimer = 0; // Frame-based invulnerability timer
        
        // Load custom character sprites (1000x1000)
        this.sprites = {
            idle: [new Image(), new Image()],
            walkRight: [new Image(), new Image()],
            walkLeft: [new Image(), new Image()],
            jump: [new Image(), new Image()]
        };
        this.sprites.idle[0].src = 'asset/utama/Galuh/Idle/Idle 1.png';
        this.sprites.idle[1].src = 'asset/utama/Galuh/Idle/Idle 2.png';
        this.sprites.walkRight[0].src = 'asset/utama/Galuh/Walk/Walk kanan 1.png';
        this.sprites.walkRight[1].src = 'asset/utama/Galuh/Walk/Walk kanan 2.png';
        this.sprites.walkLeft[0].src = 'asset/utama/Galuh/Walk/Walk kiri 1.png';
        this.sprites.walkLeft[1].src = 'asset/utama/Galuh/Walk/Walk kiri 2.png';
        this.sprites.jump[0].src = 'asset/utama/Galuh/Jump/Jump 1.png';
        this.sprites.jump[1].src = 'asset/utama/Galuh/Jump 2/Jump 2.png';
        
        this.sprites.attackBasic = [];
        for (let i = 1; i <= 3; i++) {
            let img = new Image();
            img.src = `asset/utama/Galuh/Attack/${i}.png`;
            this.sprites.attackBasic.push(img);
        }
        
        this.sprites.hurt = [];
        for (let i = 1; i <= 2; i++) {
            let img = new Image();
            img.src = `asset/utama/Galuh/Hurt/${i}.png`;
            this.sprites.hurt.push(img);
        }

        this.sprites.died = [new Image(), new Image()];
        this.sprites.died[0].src = 'asset/utama/Galuh/Die/1.png';
        this.sprites.died[1].src = 'asset/utama/Galuh/Die/2.png';

        this.sprites.attackHeavy = [];
        for (let i = 1; i <= 4; i++) {
            let img = new Image();
            img.src = `asset/utama/Galuh/Heavy attack/${i}.png`;
            this.sprites.attackHeavy.push(img);
        }

        // SFX
        this.sfxBasicAttack = new Audio('asset/music & SFX/sfx/Galuh Basic Attack.mp3');
        this.sfxBasicAttack.volume = 0.5;
        this.sfxHeavyAttack = new Audio('asset/music & SFX/sfx/Heavy Attack Galuh.mp3');
        this.sfxHeavyAttack.volume = 0.5;
    }

    update(input, platforms) { // proses fisika dan input tiap frame
        if (!this.alive) {
            this.animTimer++;
            this.vy += GRAVITY;
            this.vx *= FRICTION; // Tambahkan gesekan agar mayatnya tidak meluncur tanpa batas ke luar layar
            resolveCollisions(this, platforms);
            return;
        }
        
        if (typeof this.x !== 'number' || isNaN(this.x) || typeof this.y !== 'number' || isNaN(this.y)) {
            this.x = this.spawnX || 80;
            this.y = this.spawnY || 400;
            this.vx = 0;
            this.vy = 0;
        }

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

        // Update invulnerability timer (frame-based, bukan setTimeout)
        if (this._invulTimer > 0) {
            this._invulTimer--;
            if (this._invulTimer <= 0) {
                this.isInvulnerable = false;
            }
        }
        
        // Update hurt timer
        if (this.hurtTimer > 0) {
            this.hurtTimer--;
        }

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
                this.attackTimer = 25; // frames (approx 416ms)
                this._createHitbox(40, 20, 10);
                this.sfxBasicAttack.volume = 0.5 * (window.gameSettings ? window.gameSettings.sfxVolume : 1.0);
                this.sfxBasicAttack.currentTime = 0;
                this.sfxBasicAttack.volume = 1.0 * (window.gameSettings ? window.gameSettings.sfxVolume : 1.0);
                this.sfxBasicAttack.play().catch(e => console.log(e));
            } else if (input.isJustPressed('ShiftLeft') && this.score >= 20) { // Dash
                this.score -= 20;
                this.isDashing = true;
                this.isInvulnerable = true;
                this.dashTimer = 15; // frames
            } else if (input.isJustPressed('KeyK') && this.score >= 50) { // Heavy Attack
                this.score -= 50;
                this.isHeavyAttacking = true;
                this.heavyTimer = 30; // frames
                this._createHitbox(60, 40, 20, true);
                this.sfxHeavyAttack.volume = 0.5 * (window.gameSettings ? window.gameSettings.sfxVolume : 1.0);
                this.sfxHeavyAttack.currentTime = 0;
                this.sfxHeavyAttack.volume = 1.0 * (window.gameSettings ? window.gameSettings.sfxVolume : 1.0);
                this.sfxHeavyAttack.play().catch(e => console.log(e));
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

    draw(ctx, camX) { // render karakter ke canvas
        const drawX = this.x - camX;
        const drawY = this.y;

        ctx.save();
        
        let img = null;
        const isHurt = this.isInvulnerable && !this.isDashing;
        let isOneDirectional = false;
        
        if (!this.alive) {
            let frameIdx = Math.min(1, Math.floor(this.animTimer / 45)); // Diperlama jadi 45 frame per gambar
            img = this.sprites.died[frameIdx];
            isOneDirectional = true;
        } else if (this.isHeavyAttacking) {
            let frameIdx = Math.floor(((30 - this.heavyTimer) / 30) * this.sprites.attackHeavy.length);
            frameIdx = Math.min(this.sprites.attackHeavy.length - 1, Math.max(0, frameIdx));
            img = this.sprites.attackHeavy[frameIdx];
            isOneDirectional = true;
        } else if (this.hurtTimer > 0) {
            let frameIdx = Math.floor(this.animTimer / 5) % this.sprites.hurt.length;
            img = this.sprites.hurt[frameIdx];
            isOneDirectional = true;
        } else if (this.isAttacking) {
            let frameIdx = Math.floor(((25 - this.attackTimer) / 25) * this.sprites.attackBasic.length);
            frameIdx = Math.min(this.sprites.attackBasic.length - 1, Math.max(0, frameIdx));
            img = this.sprites.attackBasic[frameIdx];
            isOneDirectional = true;
        } else if (!this.grounded) {
            img = this.sprites.jump[Math.floor(this.animTimer / 12) % 2];
            isOneDirectional = true;
        } else if (Math.abs(this.vx) > 0.5) {
            img = this.facingRight ? 
                  this.sprites.walkRight[Math.floor(this.animTimer / 10) % 2] : 
                  this.sprites.walkLeft[Math.floor(this.animTimer / 10) % 2];
        } else {
            img = this.sprites.idle[Math.floor(this.animTimer / 20) % 2];
            isOneDirectional = true;
        }

        if (img && img.complete) {
            let drawW = 90;
            let drawH = 90;
            let offsetY = 15;
            
            // Perbesar khusus untuk sprite yang artwork-nya kekecilan
            if (this.isAttacking || this.isHeavyAttacking || this.hurtTimer > 0 || !this.alive) {
                drawW = 110;
                drawH = 110;
                offsetY = 18; // Kompensasi offset proporsional
            }
            
            const imgX = drawX + this.w / 2 - drawW / 2;
            const imgY = drawY + this.h - drawH + offsetY;
            
            const needFlip = !this.facingRight && isOneDirectional;
            
            ctx.save();
            if (needFlip) {
                ctx.translate(drawX + this.w / 2, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(img, -drawW / 2, imgY, drawW, drawH);
            } else {
                ctx.drawImage(img, imgX, imgY, drawW, drawH);
            }
            ctx.restore();
        }

        // Dash aura removed per request

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
        // this.score = 0; // Score tidak di-reset otomatis agar terbawa ke level selanjutnya
        this.barsCollected = 0;
        this.quizCorrect = 0;
        this.jumpCount = 0;
        this.animTimer = 0;
        this.hurtTimer = 0;
        this.isInvulnerable = false;
        this._invulTimer = 0;
        this.isAttacking = false;
        this.isHeavyAttacking = false;
        this.attackTimer = 0;
        this.heavyTimer = 0;
    }
}
