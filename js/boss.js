import { checkAABB } from './physics.js';

export class SuboAI {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 120; // Skala turun dari 160
        this.h = 144; // Skala turun dari 192
        this.hp = 1000;
        
        this.vx = 0;
        this.vy = 0;
        this.speed = 0;
        this.gravity = 0.55;
        
        this.state = 'IDLE';
        this.timer = 0;
        this.phase = 1;
        this.invulnerable = false;
        
        // FSM Params
        this.targetX = 0;
        this.campTimer = 0; // untuk deteksi anti-air
        
        // Visual
        this.color = '#ff3333';
        this.hitboxExpanded = false; // untuk sabetan
        this.tsunamiWave = null;
    }

    update(player, platforms) {
        // Cek Phase
        if (this.hp <= 660 && this.hp > 330 && this.phase === 1) {
            this.phase = 2;
            this.color = '#33ccff'; // Buaya mode
        } else if (this.hp <= 330 && this.phase === 2) {
            this.phase = 3;
            this.color = '#cc33ff'; // Tsunami mode
        }

        // Gravitasi boss
        this.vy += this.gravity;
        if (this.vy > 12) this.vy = 12;
        
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
        
        this.x += this.vx;

        // FSM
        this.timer--;
        
        switch (this.state) {
            case 'IDLE':
                this.vx = 0;
                if (this.timer <= 0) {
                    this._decideNextAttack(player);
                }
                
                // Anti-air logic if player is on center platform
                if (player.y < 350 && player.x > 3900 && player.x < 4200) {
                    this.campTimer++;
                    if (this.campTimer > 120 && this.phase >= 2) {
                        this.state = 'TELEGRAPH_ANTIAIR';
                        this.timer = 30; // 500ms
                    }
                } else {
                    this.campTimer = 0;
                }
                break;
                
            case 'TELEGRAPH_SWIPE':
                this.vx = 0;
                if (this.timer <= 0) {
                    this.state = 'ATTACK_SWIPE';
                    this.timer = 15; // Active frames
                    this.hitboxExpanded = true;
                }
                break;
                
            case 'ATTACK_SWIPE':
                if (this.timer <= 0) {
                    this.hitboxExpanded = false;
                    this.state = 'IDLE';
                    this.timer = this.phase === 3 ? 40 : 60; // Recovery
                }
                break;
                
            case 'TELEGRAPH_CHARGE':
                this.vx = 0;
                if (this.timer <= 0) {
                    this.state = 'ATTACK_CHARGE';
                    this.timer = 30; // Dash duration
                    this.vx = player.x < this.x ? -10 : 10;
                }
                break;
                
            case 'ATTACK_CHARGE':
                // Check wall bounds
                if (this.x < 3600 || this.x > 4500 - this.w) {
                    this.vx = 0;
                }
                if (this.timer <= 0) {
                    this.vx = 0;
                    this.state = 'IDLE';
                    this.timer = this.phase === 3 ? 40 : 60; // Recovery
                }
                break;
                
            case 'TELEGRAPH_ANTIAIR':
                this.vx = 0;
                if (this.timer <= 0) {
                    this.state = 'ATTACK_ANTIAIR';
                    this.vy = -18; // Leap
                    this.vx = player.x < this.x ? -5 : 5;
                    this.timer = 60;
                }
                break;
                
            case 'ATTACK_ANTIAIR':
                if (grounded) {
                    this.vx = 0;
                    this.state = 'IDLE';
                    this.timer = this.phase === 3 ? 40 : 60;
                }
                break;
                
            case 'TELEGRAPH_TSUNAMI':
                this.vx = 0;
                if (this.timer <= 0) {
                    this.state = 'ATTACK_TSUNAMI';
                    this.timer = 120;
                    // Spawn wave
                    this.tsunamiWave = {
                        y: 460, w: 20, h: 20
                    };
                }
                break;
                
            case 'ATTACK_TSUNAMI':
                if (this.timer <= 0) {
                    this.tsunamiWave = null;
                    this.state = 'IDLE';
                    this.timer = 40;
                }
                break;
                
            case 'HITSTOP':
                // Freeze
                if (this.timer <= 0) {
                    this.state = 'IDLE';
                    this.timer = 20;
                }
                break;
        }

        // Tembok arena boss
        if (this.x < 3600) this.x = 3600;
        if (this.x > 4560 - this.w) this.x = 4560 - this.w;
    }

    _decideNextAttack(player) {
        let rand = Math.random();
        if (this.phase === 3 && rand < 0.3) {
            // Jump to center and tsunami
            this.x = 4080 - this.w/2;
            this.state = 'TELEGRAPH_TSUNAMI';
            this.timer = 45; // 750ms
        } else if (Math.abs(player.x - this.x) < 150) {
            this.state = 'TELEGRAPH_SWIPE';
            this.timer = 45; // 750ms
        } else {
            this.state = 'TELEGRAPH_CHARGE';
            this.timer = 40; // 667ms
        }
    }

    takeDamage(amount, isFrontal, isHeavy) {
        if (this.state === 'HITSTOP') return false;

        // Phase 2 Armor
        if (this.phase >= 2 && isFrontal && !isHeavy) {
            return 'DEFLECT';
        }

        this.hp -= amount;
        
        if (isHeavy) {
            this.state = 'HITSTOP';
            this.timer = 30; // 500ms stagger
            this.vx = 0;
        }
        
        return true; 
    }

    draw(ctx, camX) {
        let drawX = this.x - camX;
        let drawW = this.w;
        let drawH = this.h;
        let drawY = this.y;

        if (this.hitboxExpanded) {
            drawW = 240; // Expanded wipe
            drawH = 45;
            drawY = this.y + this.h - drawH;
            drawX = this.x - camX - (240 - this.w)/2;
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(drawX, drawY, drawW, drawH);
        
        // Mata
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x - camX + 20, this.y + 30, 20, 20);
        ctx.fillRect(this.x - camX + 80, this.y + 30, 20, 20);
        
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x - camX + 28, this.y + 38, 8, 8);
        ctx.fillRect(this.x - camX + 88, this.y + 38, 8, 8);
        
        // Alis marah
        ctx.fillStyle = '#000';
        ctx.fillRect(this.x - camX + 10, this.y + 15, 35, 10);
        ctx.fillRect(this.x - camX + 70, this.y + 15, 35, 10);

        // Tsunami Wave
        if (this.tsunamiWave) {
            ctx.fillStyle = '#4a8ef7';
            // Wave left
            let waveLeftX = (4080 - (120 - this.timer)*10) - camX;
            ctx.fillRect(waveLeftX, this.tsunamiWave.y, this.tsunamiWave.w, this.tsunamiWave.h);
            // Wave right
            let waveRightX = (4080 + (120 - this.timer)*10) - camX;
            ctx.fillRect(waveRightX, this.tsunamiWave.y, this.tsunamiWave.w, this.tsunamiWave.h);
        }
    }

    getHitboxes() {
        let boxes = [];
        if (this.hitboxExpanded) {
            boxes.push({
                x: this.x - (240 - this.w)/2,
                y: this.y + this.h - 45,
                w: 240, h: 45
            });
        } else {
            boxes.push({ x: this.x, y: this.y, w: this.w, h: this.h });
        }
        
        if (this.tsunamiWave && this.state === 'ATTACK_TSUNAMI') {
            boxes.push({
                x: 4080 - (120 - this.timer)*10,
                y: this.tsunamiWave.y, w: 20, h: 20
            });
            boxes.push({
                x: 4080 + (120 - this.timer)*10,
                y: this.tsunamiWave.y, w: 20, h: 20
            });
        }
        return boxes;
    }
}
