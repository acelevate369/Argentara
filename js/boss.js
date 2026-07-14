import { checkAABB } from './physics.js';

export class SuboAI {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 64; // Boss lebih besar
        this.h = 64;
        this.hp = 3; // 3 kali injak kepala
        
        this.vx = 0;
        this.vy = 0;
        this.speed = 2.5;
        this.gravity = 0.55;
        
        this.state = 'INTRO';
        this.timer = 0;
        
        // Warna sementara representasi Subo
        this.color = '#ff3333';
        
        this.invulnerable = false;
        this.invulnTimer = 0;
    }

    update(player, platforms) {
        this.timer++;
        
        // Gravitasi boss
        this.vy += this.gravity;
        if (this.vy > 12) this.vy = 12;
        
        // Resolusi vertikal
        this.y += this.vy;
        let grounded = false;
        for (const plat of platforms) {
            if (checkAABB(this, plat)) {
                if (this.vy > 0) {
                    this.y = plat.y - this.h;
                    this.vy = 0;
                    grounded = true;
                }
            }
        }
        
        if (this.invulnerable) {
            this.invulnTimer--;
            if (this.invulnTimer <= 0) {
                this.invulnerable = false;
            }
        }

        switch (this.state) {
            case 'INTRO':
                // Pause sejenak
                if (this.timer > 120) {
                    this.state = 'CHASE';
                    this.timer = 0;
                }
                break;
                
            case 'CHASE':
                // Kejar pemain jika grounded
                if (grounded) {
                    if (player.x < this.x) {
                        this.vx = -this.speed;
                    } else {
                        this.vx = this.speed;
                    }
                    
                    // Kadang lompat pendek jika player melompat
                    if (player.y < this.y - 50 && Math.random() < 0.05) {
                        this.vy = -10;
                    }
                }
                
                this.x += this.vx;
                
                // Jangan keluar arena
                if (this.x < 3600) this.x = 3600;
                if (this.x > 5000 - this.w) this.x = 5000 - this.w;
                break;
                
            case 'HURT':
                this.x += this.vx; // Terpental
                if (this.timer > 40) {
                    this.state = 'CHASE';
                    this.timer = 0;
                }
                break;
        }
    }

    takeDamage() {
        if (this.invulnerable) return false;
        
        this.hp--;
        this.state = 'HURT';
        this.timer = 0;
        this.vx = (Math.random() > 0.5 ? 1 : -1) * 3; // Terpental
        this.vy = -5;
        this.invulnerable = true;
        this.invulnTimer = 60; // 1 detik invuln
        
        // Tambah sulit
        this.speed += 0.5;
        
        return true; // Sukses kena damage
    }

    draw(ctx, camX) {
        if (this.invulnerable && Math.floor(this.invulnTimer / 5) % 2 === 0) {
            // Blink saat invulnerable
            return;
        }
        
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - camX, this.y, this.w, this.h);
        
        // Mata seram
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x - camX + 10, this.y + 15, 12, 12);
        ctx.fillRect(this.x - camX + 40, this.y + 15, 12, 12);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x - camX + 14, this.y + 19, 4, 4);
        ctx.fillRect(this.x - camX + 44, this.y + 19, 4, 4);
        
        // Alis marah
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x - camX + 5, this.y + 8, 20, 5);
        ctx.fillRect(this.x - camX + 35, this.y + 8, 20, 5);
    }
}
