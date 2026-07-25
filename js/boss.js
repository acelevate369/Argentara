import { checkAABB } from './physics.js';

export class SuboAI {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 56; // Diperkecil drastis agar ekornya tidak nyangkut di platform (bikin seolah melayang)
        this.h = 110; // Tinggi hitbox disesuaikan agar pas dengan badannya
        this.hp = 300;
        this.maxHp = 300;
        
        this.vx = 0;
        this.vy = 0;
        this.speed = 0;
        this.gravity = 0.55;
        
        this.state = 'IDLE';
        this.timer = 0;
        this.phase = 1;
        this.invulnerable = false;
        this.isDead = false;
        
        // FSM Params
        this.targetX = 0;
        this.campTimer = 0; // untuk deteksi anti-air
        
        // Visual
        this.color = '#ff3333';
        this.hitboxExpanded = false; // untuk sabetan
        this.tsunamiWave = null;
        this.animTimer = 0;
        
        // Load Custom Sprites (Arrays)
        this.sprites = {
            idle: [new Image(), new Image()],
            swipe: [],
            jump: [],
            dash: [],
            ultimate: [],
            ultimateOmbak: []
        };
        this.sprites.idle[0].src = 'asset/utama/Bos 1.png';
        this.sprites.idle[1].src = 'asset/utama/Bos 2.png';
        
        for (let i = 32; i <= 34; i++) {
            let img = new Image();
            img.src = `asset/utama/Subo_Sabetan_Jarak_Dekat/${i}.png`;
            this.sprites.swipe.push(img);
        }
        for (let i = 41; i <= 43; i++) {
            let img = new Image();
            img.src = `asset/utama/Subo_Lompat/${i}.png`;
            this.sprites.jump.push(img);
        }
        for (let i = 36; i <= 39; i++) {
            let img = new Image();
            img.src = `asset/utama/Subo_Dash/${i}.png`;
            this.sprites.dash.push(img);
        }
        for (let i = 45; i <= 49; i++) {
            let img = new Image();
            img.src = `asset/utama/Subo_Ultimate/${i}.png`;
            this.sprites.ultimate.push(img);
        }
        for (let i = 50; i <= 55; i++) {
            let img = new Image();
            img.src = `asset/utama/Subo_Ultimate/Ultimate_Ombak/${i}.png`;
            this.sprites.ultimateOmbak.push(img);
        }
        
        this.sprites.hurt = new Image();
        this.sprites.hurt.src = 'asset/utama/Subo_Hurt.png';

        // SFX
        this.sfxSwipe = new Audio('asset/music & SFX/sfx/Subo Sabetan Dekat.mp3');
        this.sfxSwipe.volume = 0.5;
        this.sfxDash = new Audio('asset/music & SFX/sfx/Dash Subo.mp3');
        this.sfxDash.volume = 0.15;
        this.sfxLanding = new Audio('asset/music & SFX/sfx/Landing Subo.mp3');
        this.sfxLanding.volume = 0.15;
    }

    update(player, platforms) {
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
        
        if (this.state === 'DEAD') return false;

        this.animTimer++;

        // State Machine
        switch (this.state) {
            case 'IDLE':
                this.vx = 0;
                if (this.timer <= 0) {
                    this._decideNextAttack(player);
                }
                break;
                
            case 'TELEGRAPH_SWIPE':
                this.vx = 0;
                if (this.timer <= 0) {
                    this.state = 'ATTACK_SWIPE';
                    this.timer = 40;
                    this.hitboxExpanded = true;
                    this.sfxSwipe.volume = 1.0 * (window.gameSettings ? window.gameSettings.sfxVolume : 1.0);
                    this.sfxSwipe.currentTime = 0;
                    this.sfxSwipe.play().catch(e => console.log(e));
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
                    this.vx = player.x < this.x ? -6 : 6;
                    this.sfxDash.volume = 0.8 * (window.gameSettings ? window.gameSettings.sfxVolume : 1.0);
                    this.sfxDash.currentTime = 0;
                    this.sfxDash.play().catch(e => console.log(e));
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
                    // Kalkulasi vx untuk mendarat tepat di posisi player (jarak / waktu di udara)
                    let dx = player.x - this.x;
                    let timeInAir = (18 / this.gravity) * 2;
                    this.vx = dx / timeInAir;
                    // Cap batas kecepatan
                    if (this.vx > 16) this.vx = 16;
                    if (this.vx < -16) this.vx = -16;
                    this.timer = 60;
                }
                break;
                
            case 'ATTACK_ANTIAIR':
                if (grounded) {
                    this.vx = 0;
                    this.state = 'RECOVERY_ANTIAIR';
                    this.timer = 20; // Landing lag
                    this.sfxLanding.volume = 0.8 * (window.gameSettings ? window.gameSettings.sfxVolume : 1.0);
                    this.sfxLanding.currentTime = 0;
                    this.sfxLanding.play().catch(e => console.log(e));
                }
                break;
                
            case 'RECOVERY_ANTIAIR':
                if (this.timer <= 0) {
                    this.state = 'IDLE';
                    this.timer = this.phase === 3 ? 20 : 40;
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
                
            case 'HURT':
                // Brief hurt flash for basic attacks
                this.hurtTimer--;
                if (this.hurtTimer <= 0) {
                    // Kembali ke state sebelumnya
                    this.state = this._prevState || 'IDLE';
                    this.timer = this._prevTimer || 20;
                }
                break;
                
            case 'DYING':
                // Terus jatuh ke tanah
                if (this.y < 380) {
                    this.y += 10;
                }
                
                if (this.timer <= 0) {
                    this.state = 'DEAD';
                }
                break;
        }

        // Tembok arena boss
        this.x += this.vx;
        if (this.x < 3600) this.x = 3600;
        if (this.x > 4560 - this.w) this.x = 4560 - this.w;
        
        if (this.timer > 0) this.timer--;
    }

    _decideNextAttack(player) {
        let rand = Math.random();
        if (this.phase === 3 && rand < 0.3) {
            // Jump to center and tsunami
            this.x = 4080 - this.w/2;
            this.state = 'TELEGRAPH_TSUNAMI';
            this.timer = 45; // 750ms
        } else if (Math.abs(player.x - this.x) < 150 && player.y + player.h >= this.y + this.h - 60 && player.y <= this.y + this.h + 20) {
            this.state = 'TELEGRAPH_SWIPE';
            this.timer = 45; // 750ms
        } else {
            // Player agak jauh atau di atas panel surya
            let jumpChance = (player.y < this.y - 50) ? 0.8 : 0.3; // 80% chance lompat jika player ngendok di atas
            if (Math.random() < jumpChance) {
                this.state = 'TELEGRAPH_ANTIAIR';
                this.timer = 30; // 500ms telegraph
                this._lastFaceRight = (player.x > this.x);
            } else {
                this.state = 'TELEGRAPH_CHARGE';
                this.timer = 40; // 667ms
                this._chargeTargetRight = (player.x > this.x); // Simpan arah target
            }
        }
    }

    takeDamage(amount, isFrontal, isHeavy, attackerX) {
        if (this.state === 'HITSTOP') return false;

        // Phase 2 Armor
        if (this.phase >= 2 && isFrontal && !isHeavy) {
            return 'DEFLECT';
        }

        this.hp -= amount;
        
        // Simpan arah hadap saat terkena serangan (menghadap ke sumber serangan)
        if (attackerX !== undefined) {
            this.lastHitFaceRight = (attackerX > this.x);
        }
        
        // Phase transition logic
        if (this.phase === 1 && this.hp <= 200) {
            this.phase = 2;
            this.hp = 200;
        } else if (this.phase === 2 && this.hp <= 100) {
            this.phase = 3;
            this.hp = 100;
        }

        if (this.hp <= 0) {
            this.isDead = true;
            this.state = 'DYING';
            this.timer = 120;
            return true;
        }
        
        if (isHeavy) {
            this.state = 'HITSTOP';
            this.timer = 30; // 500ms stagger
            this.vx = 0;
            this.hitboxExpanded = false;
            this.tsunamiWave = null;
        } else {
            // Basic attack: tampilkan hurt sprite sebentar (10 frame ≈ 167ms)
            this._prevState = this.state;
            this._prevTimer = this.timer;
            this.state = 'HURT';
            this.hurtTimer = 10;
        }
        
        return true; 
    }

    draw(ctx, camX) {
        if (this.state === 'DEAD') return;

        let drawX = this.x - camX;
        let drawY = this.y;

        if (this.state === 'DYING') {
            drawX += (Math.random() - 0.5) * 10;
            drawY += (Math.random() - 0.5) * 10;
            ctx.globalAlpha = (this.timer % 10 > 5) ? 0.5 : 1.0;
        }

        ctx.save();
        
        let img = null;
        let isOneDirectional = false;
        
        if (this.state === 'IDLE') {
            img = this.sprites.idle[Math.floor(this.animTimer / 20) % 2];
        } else if (this.state === 'TELEGRAPH_CHARGE' || this.state === 'ATTACK_CHARGE') {
            let frameIdx = Math.floor(this.animTimer / 12) % this.sprites.dash.length;
            img = this.sprites.dash[frameIdx];
            isOneDirectional = true;
        } else if (this.state === 'TELEGRAPH_ANTIAIR') {
            img = this.sprites.jump[0]; // 41.png ancang-ancang
            isOneDirectional = true;
        } else if (this.state === 'ATTACK_ANTIAIR') {
            img = this.sprites.jump[1]; // 42.png melayang
            isOneDirectional = true;
        } else if (this.state === 'RECOVERY_ANTIAIR') {
            img = this.sprites.jump[2]; // 43.png mendarat
            isOneDirectional = true;
        } else if (this.state === 'TELEGRAPH_SWIPE' || this.state === 'ATTACK_SWIPE') {
            // Sabetan: 40 frame durasi / 13 ≈ 3 frame unik, sedikit lebih cepat
            let frameIdx = Math.floor((40 - this.timer) / 13); 
            frameIdx = Math.min(this.sprites.swipe.length - 1, Math.max(0, frameIdx));
            img = this.sprites.swipe[frameIdx];
            isOneDirectional = true;
        } else if (this.state === 'TELEGRAPH_TSUNAMI' || this.state === 'ATTACK_TSUNAMI') {
            let frameIdx = Math.floor(this.animTimer / 8) % this.sprites.ultimate.length;
            img = this.sprites.ultimate[frameIdx];
            isOneDirectional = true;
        } else if (this.state === 'HITSTOP' || this.state === 'DYING' || this.state === 'HURT') {
            img = this.sprites.hurt;
            isOneDirectional = true;
        }

        if (img && img.complete) {
            // User memaksakan ukuran seragam agar tidak notice beda frame
            let drawW = 130;
            let drawH = 130;
            
            // Sabetan digambar sedikit lebih kecil lebarnya agar seamless dengan Idle
            if (this.state.includes('SWIPE')) {
                drawW = 110;
            }
            
            // X ditaruh di tengah hitbox
            const imgX = drawX + this.w/2 - drawW/2;
            // Y ditaruh menempel di tanah (offset ditambah sedikit jika sprite punya whitespace di bawah)
            const imgY = drawY + this.h - drawH + 20; 
            
            // Determine facing direction based on state
            let faceRight;
            
            if (this.state === 'HITSTOP' || this.state === 'DYING') {
                // Saat terluka/dying: sprite asli menghadap KIRI (terdorong ke kiri).
                // Jadi jika attacker di KANAN (lastHitFaceRight=true), Subo harus menghadap KIRI = sprite asli = faceRight FALSE
                // Jika attacker di KIRI (lastHitFaceRight=false), Subo harus menghadap KANAN = flip = faceRight TRUE
                if (this.lastHitFaceRight !== undefined) {
                    faceRight = !this.lastHitFaceRight; // Terbalik: menghadap MENJAUHI attacker
                } else {
                    faceRight = false;
                }
            } else if (this.state === 'TELEGRAPH_TSUNAMI' || this.state === 'ATTACK_TSUNAMI') {
                // Ultimate: hadap berdasarkan posisi terakhir (vx bisa 0)
                faceRight = false; // Default, ultimate biasanya di tengah
            } else if (this.state === 'TELEGRAPH_CHARGE' || this.state === 'ATTACK_CHARGE') {
                // Dash: arah ditentukan oleh vx ATAU posisi saat telegraph (vx masih 0)
                if (this.vx !== 0) {
                    faceRight = (this.vx > 0);
                } else {
                    // Saat telegraph, belum ada vx, gunakan facingRight yang disimpan
                    faceRight = this._chargeTargetRight || false;
                }
            } else if (this.vx !== 0) {
                faceRight = (this.vx > 0);
            } else {
                // Idle atau vx=0: hadap ke arah terakhir yang diketahui
                faceRight = this._lastFaceRight || false;
            }
            
            // Simpan arah terakhir untuk referensi
            if (this.state !== 'HITSTOP' && this.state !== 'DYING') {
                this._lastFaceRight = faceRight;
            }

            const needFlip = !faceRight && isOneDirectional;

            if (needFlip) {
                ctx.save();
                ctx.translate(drawX + this.w, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(img, 0, imgY, drawW, drawH);
                ctx.restore();
            } else {
                ctx.drawImage(img, imgX, imgY, drawW, drawH);
            }
        }
        ctx.restore();

        // Render Tsunami Wave
        if (this.tsunamiWave) {
            // Hitung frame berdasarkan progres serangan (120 frame total)
            let frameIdx = Math.floor((120 - this.timer) / 20); // Ganti tiap 20 frame
            frameIdx = Math.min(this.sprites.ultimateOmbak.length - 1, Math.max(0, frameIdx));
            let ombakImg = this.sprites.ultimateOmbak[frameIdx];
            
            if (ombakImg && ombakImg.complete) {
                ctx.save();
                
                // Gambar gelombang ke kiri (wave1X)
                let wave1X = this.x - (120 - this.timer)*4 - camX;
                ctx.save();
                if (frameIdx === 5) {
                    // Frame 55 (splash) default menghantam dinding kiri, jadi TIDAK di-flip
                    ctx.drawImage(ombakImg, wave1X, this.tsunamiWave.y - 100, 150, 150);
                } else {
                    // Frame ombak biasa menghadap kanan, jadi untuk ke kiri HARUS di-flip
                    ctx.translate(wave1X + 75, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(ombakImg, -75, this.tsunamiWave.y - 100, 150, 150);
                }
                ctx.restore();

                // Gambar gelombang ke kanan (wave2X)
                let wave2X = this.x + this.w + (120 - this.timer)*4 - camX;
                ctx.save();
                if (frameIdx === 5) {
                    // Frame 55 (splash) default menghantam dinding kiri, jadi untuk ke kanan HARUS di-flip
                    ctx.translate(wave2X + 75, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(ombakImg, -75, this.tsunamiWave.y - 100, 150, 150);
                } else {
                    // Frame ombak biasa menghadap kanan, jadi TIDAK di-flip
                    ctx.drawImage(ombakImg, wave2X, this.tsunamiWave.y - 100, 150, 150);
                }
                ctx.restore();
                
                // RESTORE THE OUTER SAVE TO PREVENT CONTEXT LEAK!
                ctx.restore();
            }
        }

        if (this.state === 'DYING') {
            ctx.globalAlpha = 1.0;
            const progress = 1 - (this.timer / 120); // 0 to 1
            
            // Latar belakang kilat putih saat baru mulai mati
            if (progress < 0.1) {
                ctx.fillStyle = 'rgba(255, 255, 255, ' + (1 - progress * 10) + ')';
                ctx.fillRect(drawX - 200, drawY - 200, this.w + 400, this.h + 400);
            }
            
            // Epic Explosions!
            for (let i = 0; i < 3; i++) {
                if (Math.random() > 0.2) {
                    const colors = ['#ffffff', '#ffea00', '#ff8800', '#ff2200'];
                    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                    
                    const exX = drawX + Math.random() * this.w;
                    const exY = drawY + Math.random() * this.h;
                    const exRadius = Math.random() * 40 + 20 + (progress * 50); // Makin lama makin besar
                    
                    ctx.beginPath();
                    // Bikin bintang/duri ledakan ala SVG comic
                    const spikes = 8 + Math.floor(Math.random() * 6);
                    for(let j = 0; j < spikes * 2; j++) {
                        const radius = j % 2 === 0 ? exRadius : exRadius * 0.4;
                        const angle = (j / (spikes * 2)) * Math.PI * 2 + (this.animTimer * 0.1);
                        ctx.lineTo(exX + Math.cos(angle) * radius, exY + Math.sin(angle) * radius);
                    }
                    ctx.closePath();
                    ctx.fill();
                }
            }
        }
    }

    getHitboxes() {
        let boxes = [];
        
        let faceRight = this._lastFaceRight || false;
        if (this.state === 'TELEGRAPH_CHARGE') {
            faceRight = this._chargeTargetRight || false;
        } else if (this.vx !== 0) {
            faceRight = (this.vx > 0);
        }

        // Smart hitboxes: semua relatif terhadap posisi boss (this.x, this.y)
        if (this.hitboxExpanded) {
            // Sabetan: hitbox panjang ke arah serangan (dikurangi range-nya)
            const swipeW = 110; 
            const swipeH = 50;
            boxes.push({
                x: faceRight ? this.x + this.w/2 : this.x - swipeW + this.w/2,
                y: this.y + this.h - swipeH,
                w: swipeW, h: swipeH
            });
        }
        
        if (this.state === 'ATTACK_CHARGE') {
            // Dash: hitbox = body boss + sedikit extended ke arah gerak (dikurangi)
            const ext = 20;
            boxes.push({
                x: faceRight ? this.x : this.x - ext,
                y: this.y + 30,
                w: this.w + ext,
                h: this.h - 30
            });
        } else if (this.state === 'ATTACK_ANTIAIR') {
            // Lompat: body boss sebagai hitbox
            boxes.push({
                x: this.x + 10,
                y: this.y,
                w: this.w - 20,
                h: this.h
            });
        } else if (!this.hitboxExpanded) {
            // Default body hitbox (idle, telegraph, etc)
            boxes.push({
                x: this.x + 15,
                y: this.y + 10,
                w: this.w - 30,
                h: this.h - 10
            });
        }
        
        // Tsunami waves: relatif terhadap posisi boss
        if (this.tsunamiWave && this.state === 'ATTACK_TSUNAMI') {
            const waveOffset = (120 - this.timer) * 4;
            // Ombak kiri
            boxes.push({
                x: this.x - waveOffset,
                y: this.tsunamiWave.y - 80, w: 80, h: 80
            });
            // Ombak kanan
            boxes.push({
                x: this.x + this.w + waveOffset - 80,
                y: this.tsunamiWave.y - 80, w: 80, h: 80
            });
        }
        return boxes;
    }
}
