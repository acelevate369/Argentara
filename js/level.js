

import { checkAABB } from './physics.js';

import { QUIZ_EASY, QUIZ_MEDIUM, QUIZ_HARD, WARTA_FACTS } from './quiz-database.js';

function createLevel1() { // generate data statis untuk level 1
    return {
        name: "Desa Argentara - Level 1 (Easy)",
        mission: "Kumpulkan 4 Argen-bars & Selesaikan Kuis!",
        width: 4800,
        height: 540,
        requiredBars: 4,
        playerSpawn: { x: 80, y: 400 },
        quizData: QUIZ_EASY,
        platforms: [
            { x: 0, y: 480, w: 1000, h: 60, type: 'ground' },
            { x: 1200, y: 480, w: 1000, h: 60, type: 'ground' },
            { x: 2350, y: 480, w: 1000, h: 60, type: 'ground' },
            { x: 3500, y: 480, w: 1300, h: 60, type: 'ground' },
            
            { x: 400, y: 390, w: 128, h: 20, type: 'solar' },
            { x: 650, y: 310, w: 128, h: 20, type: 'solar' },
            { x: 900, y: 390, w: 128, h: 20, type: 'solar' },
            { x: 1400, y: 390, w: 128, h: 20, type: 'solar' },
            { x: 1650, y: 310, w: 128, h: 20, type: 'solar' },
            { x: 1900, y: 230, w: 128, h: 20, type: 'solar' },
            { x: 2600, y: 390, w: 128, h: 20, type: 'solar' },
            { x: 2850, y: 310, w: 128, h: 20, type: 'solar' },
            { x: 3100, y: 390, w: 128, h: 20, type: 'solar' }
        ],
        collectibles: [
            { x: 450, y: 360, w: 20, h: 16, type: 'silver', collected: false },
            { x: 1700, y: 280, w: 20, h: 16, type: 'silver', collected: false },
            { x: 2650, y: 360, w: 20, h: 16, type: 'silver', collected: false },
            { x: 3150, y: 360, w: 20, h: 16, type: 'silver', collected: false },
            
            { x: 700, y: 280, w: 20, h: 20, type: 'warta', collected: false, factIndex: 0 },
            { x: 950, y: 360, w: 20, h: 20, type: 'warta', collected: false, factIndex: 1 },
            { x: 1950, y: 200, w: 20, h: 20, type: 'warta', collected: false, factIndex: 2 },
            { x: 2900, y: 280, w: 20, h: 20, type: 'warta', collected: false, factIndex: 3 },
            { x: 3900, y: 450, w: 20, h: 20, type: 'warta', collected: false, factIndex: 4 }
        ],
        hazards: [
            { x: 1050, y: 456, w: 100, h: 24, type: 'electric_floor' },
            { x: 2230, y: 456, w: 120, h: 24, type: 'electric_floor' },
            { x: 3370, y: 456, w: 130, h: 24, type: 'electric_floor' }
        ],
        npcs: [
            { x: 600, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 0, quizDone: false, interactZone: { x: 560, y: 400, w: 100, h: 80 } },
            { x: 1500, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 1, quizDone: false, interactZone: { x: 1460, y: 400, w: 100, h: 80 } },
            { x: 2100, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 2, quizDone: false, interactZone: { x: 2060, y: 400, w: 100, h: 80 } },
            { x: 2800, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 3, quizDone: false, interactZone: { x: 2760, y: 400, w: 100, h: 80 } },
            { x: 4200, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 4, quizDone: false, interactZone: { x: 4160, y: 400, w: 100, h: 80 } }
        ],
        finishGate: { x: 4600, y: 380, w: 80, h: 100 },
        hasBoss: false
    };
}

function createLevel2() { // generate data statis untuk level 2
    return {
        name: "Pabrik Terbengkalai - Level 2 (Medium)",
        mission: "Kumpulkan 5 Argen-bars & Hati-hati jebakan!",
        width: 5000,
        height: 540,
        requiredBars: 5,
        playerSpawn: { x: 80, y: 400 },
        quizData: QUIZ_MEDIUM,
        platforms: [
            { x: 0, y: 480, w: 800, h: 60, type: 'ground' },
            { x: 950, y: 480, w: 700, h: 60, type: 'ground' },
            { x: 1800, y: 480, w: 900, h: 60, type: 'ground' },
            { x: 2850, y: 480, w: 800, h: 60, type: 'ground' },
            { x: 3800, y: 480, w: 1200, h: 60, type: 'ground' },
            
            { x: 300, y: 390, w: 100, h: 20, type: 'solar' },
            { x: 550, y: 310, w: 100, h: 20, type: 'solar' },
            { x: 800, y: 230, w: 100, h: 20, type: 'solar' },
            { x: 1600, y: 390, w: 100, h: 20, type: 'solar' },
            { x: 2200, y: 350, w: 100, h: 20, type: 'solar' },
            { x: 2600, y: 270, w: 100, h: 20, type: 'solar' },
            { x: 3450, y: 390, w: 100, h: 20, type: 'solar' }
        ],
        collectibles: [
            { x: 600, y: 280, w: 20, h: 16, type: 'silver', collected: false },
            { x: 1640, y: 360, w: 20, h: 16, type: 'silver', collected: false },
            { x: 2240, y: 320, w: 20, h: 16, type: 'silver', collected: false },
            { x: 2640, y: 240, w: 20, h: 16, type: 'silver', collected: false },
            { x: 3490, y: 360, w: 20, h: 16, type: 'silver', collected: false },
            
            { x: 340, y: 360, w: 20, h: 20, type: 'warta', collected: false, factIndex: 0 },
            { x: 840, y: 200, w: 20, h: 20, type: 'warta', collected: false, factIndex: 1 },
            { x: 1900, y: 450, w: 20, h: 20, type: 'warta', collected: false, factIndex: 2 },
            { x: 3100, y: 450, w: 20, h: 20, type: 'warta', collected: false, factIndex: 3 },
            { x: 4000, y: 450, w: 20, h: 20, type: 'warta', collected: false, factIndex: 4 }
        ],
        hazards: [
            { x: 1050, y: 456, w: 120, h: 24, type: 'electric_floor' },
            { x: 2000, y: 456, w: 120, h: 24, type: 'electric_floor' },
            { x: 3000, y: 456, w: 120, h: 24, type: 'electric_floor' }
        ],
        npcs: [
            { x: 1300, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 0, quizDone: false, interactZone: { x: 1260, y: 400, w: 100, h: 80 } },
            { x: 2400, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 1, quizDone: false, interactZone: { x: 2360, y: 400, w: 100, h: 80 } },
            { x: 3300, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 2, quizDone: false, interactZone: { x: 3260, y: 400, w: 100, h: 80 } },
            { x: 4300, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 3, quizDone: false, interactZone: { x: 4260, y: 400, w: 100, h: 80 } },
            { x: 4600, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 4, quizDone: false, interactZone: { x: 4560, y: 400, w: 100, h: 80 } }
        ],
        finishGate: { x: 4850, y: 380, w: 80, h: 100 },
        hasBoss: false
    };
}

function createLevel3() { // generate data statis untuk level 3 (Boss Level)
    return {
        name: "Markas Subo - Level 3 (Hardcore)",
        mission: "Selesaikan 5 Kuis, Kalahkan Subo!",
        width: 5000,
        height: 540,
        requiredBars: 0,
        playerSpawn: { x: 80, y: 400 },
        quizData: QUIZ_HARD,
        platforms: [
            { x: 0, y: 480, w: 1000, h: 60, type: 'ground' },
            { x: 1200, y: 480, w: 800, h: 60, type: 'ground' },
            { x: 2200, y: 480, w: 800, h: 60, type: 'ground' },
            { x: 3200, y: 480, w: 1800, h: 60, type: 'ground' }, // Boss arena panjang
            
            { x: 400, y: 390, w: 80, h: 20, type: 'solar' },
            { x: 700, y: 310, w: 80, h: 20, type: 'solar' },
            { x: 1050, y: 390, w: 80, h: 20, type: 'solar' },
            { x: 1800, y: 390, w: 80, h: 20, type: 'solar' },
            { x: 2100, y: 310, w: 80, h: 20, type: 'solar' },
            
            // Boss Arena Platforms (X starts at 3600, Canvas W 960)
            // Left Platform
            { x: 3700, y: 370, w: 150, h: 20, type: 'solar' },
            // Center Platform
            { x: 4000, y: 270, w: 150, h: 20, type: 'solar' },
            // Right Platform
            { x: 4300, y: 370, w: 150, h: 20, type: 'solar' }
        ],
        collectibles: [
            { x: 430, y: 360, w: 20, h: 20, type: 'warta', collected: false, factIndex: 0 },
            { x: 730, y: 280, w: 20, h: 20, type: 'warta', collected: false, factIndex: 1 },
            { x: 1400, y: 450, w: 20, h: 20, type: 'warta', collected: false, factIndex: 2 },
            { x: 2130, y: 280, w: 20, h: 20, type: 'warta', collected: false, factIndex: 3 },
            { x: 2800, y: 450, w: 20, h: 20, type: 'warta', collected: false, factIndex: 4 }
        ],
        hazards: [
            { x: 1200, y: 456, w: 200, h: 24, type: 'electric_floor' },
            { x: 2300, y: 456, w: 200, h: 24, type: 'electric_floor' }
        ],
        npcs: [
            { x: 900, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 0, quizDone: false, interactZone: { x: 860, y: 400, w: 100, h: 80 } },
            { x: 1600, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 1, quizDone: false, interactZone: { x: 1560, y: 400, w: 100, h: 80 } },
            { x: 2000, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 2, quizDone: false, interactZone: { x: 1960, y: 400, w: 100, h: 80 } },
            { x: 2600, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 3, quizDone: false, interactZone: { x: 2560, y: 400, w: 100, h: 80 } },
            { x: 3300, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 4, quizDone: false, interactZone: { x: 3260, y: 400, w: 100, h: 80 } }
        ],
        finishGate: null, // Gate tidak ada, diganti bos fight
        hasBoss: true,
        bossArena: { x: 3600, width: 960 } // Kamera akan dikunci di sini sesuai resolusi 960x540
    };
}

export class Level { // class manajer level dan renderer
    constructor() {
        this.data = null;
        this.animTimer = 0;
        this.particles = [];
    }

    load(levelNumber) { // muat data level berdasarkan nomor
        this.levelNumber = levelNumber;
        switch (levelNumber) {
            case 1:
                this.data = createLevel1();
                break;
            case 2:
                this.data = createLevel2();
                break;
            case 3:
                this.data = createLevel3();
                break;
            default:
                this.data = createLevel1();
                break;
        }
        this.animTimer = 0;
        this.particles = [];
    }

    checkInteractions(player) { // cek collision player dengan item/rintangan/npc
        const events = [];

        for (const item of this.data.collectibles) {
            if (!item.collected && checkAABB(player, item)) {
                item.collected = true;

                if (item.type === 'silver') {
                    player.barsCollected++;
                    player.score += 100;
                    this.spawnParticles(item.x + item.w / 2, item.y + item.h / 2, '#c0c8d4', 8);
                    events.push({ type: 'collect_silver', data: item });
                } else if (item.type === 'warta') {
                    this.spawnParticles(item.x + item.w / 2, item.y + item.h / 2, '#ffd700', 10);
                    events.push({ 
                        type: 'collect_warta', 
                        data: { fact: WARTA_FACTS[item.factIndex] || WARTA_FACTS[0] }
                    });
                }
            }
        }

        for (const hazard of this.data.hazards) {
            if (checkAABB(player, hazard)) {
                events.push({ type: 'hit_hazard', data: hazard });
            }
        }

        for (const npc of this.data.npcs) {
            if (!npc.quizDone && checkAABB(player, npc.interactZone)) {
                events.push({ type: 'near_npc', data: npc });
            }
        }

        if (this.data.finishGate && checkAABB(player, this.data.finishGate)) {
            if (player.barsCollected >= this.data.requiredBars) {
                events.push({ type: 'reach_finish', data: null });
            }
        }

        if (player.y > this.data.height + 100 || player.y < -100) {
            events.push({ type: 'fell_off', data: null });
        }

        return events;
    }

    getQuiz(index) {
        return this.data.quizData[index] || this.data.quizData[0];
    }

    spawnParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6 - 2,
                life: 30 + Math.random() * 20,
                maxLife: 50,
                size: 2 + Math.random() * 3,
                color
            });
        }
    }

    update() {
        this.animTimer++;

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15; // gravity on particles
            p.life--;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx, camX, canvasW, canvasH) { // render seluruh objek level ke layar

        this.drawBackground(ctx, camX, canvasW, canvasH);

        for (const plat of this.data.platforms) {
            this.drawPlatform(ctx, plat, camX);
        }

        for (const item of this.data.collectibles) {
            if (!item.collected) {
                this.drawCollectible(ctx, item, camX);
            }
        }

        for (const hazard of this.data.hazards) {
            this.drawHazard(ctx, hazard, camX);
        }

        for (const npc of this.data.npcs) {
            this.drawNPC(ctx, npc, camX);
        }

        if (this.data.finishGate) {
            this.drawFinishGate(ctx, this.data.finishGate, camX);
        }

        for (const p of this.particles) {
            const alpha = p.life / p.maxLife;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x - camX - p.size / 2, p.y - p.size / 2, p.size, p.size);
        }
        ctx.globalAlpha = 1;
    }

    drawBackground(ctx, camX, canvasW, canvasH) { // render efek parallax background

        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvasH);
        skyGrad.addColorStop(0, '#0a1628');
        skyGrad.addColorStop(0.5, '#132844');
        skyGrad.addColorStop(1, '#1a3a5a');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvasW, canvasH);

        ctx.fillStyle = '#ffffff';
        const starSeed = [30, 90, 150, 230, 310, 400, 480, 560, 650, 740, 820, 900];
        const starY = [40, 80, 25, 110, 60, 35, 95, 45, 70, 20, 90, 55];
        for (let i = 0; i < starSeed.length; i++) {
            const twinkle = Math.sin(this.animTimer * 0.05 + i) * 0.5 + 0.5;
            ctx.globalAlpha = 0.3 + twinkle * 0.5;
            const screenX = ((starSeed[i] - camX * 0.02) % canvasW + canvasW) % canvasW;
            ctx.fillRect(screenX, starY[i], 2, 2);
        }
        ctx.globalAlpha = 1;

        ctx.fillStyle = '#0d1f35';
        const mRate = 0.15;
        const mStep = 80;
        const mParallaxOffset = camX * mRate;
        const mStartWorld = Math.floor(mParallaxOffset / mStep) * mStep;
        ctx.beginPath();
        ctx.moveTo(0, canvasH);
        for (let worldX = mStartWorld - mStep; worldX <= mStartWorld + canvasW + mStep * 2; worldX += mStep) {
            const screenX = worldX - mParallaxOffset;
            const mh = 120 + Math.sin(worldX * 0.008) * 60 + Math.sin(worldX * 0.015) * 30;
            ctx.lineTo(screenX, canvasH - mh);
        }
        ctx.lineTo(canvasW, canvasH);
        ctx.fill();

        ctx.fillStyle = '#10263e';
        const tRate = 0.3;
        const tStep = 50;
        const tParallaxOffset = camX * tRate;
        const tStartWorld = Math.floor(tParallaxOffset / tStep) * tStep;
        ctx.beginPath();
        ctx.moveTo(0, canvasH);
        for (let worldX = tStartWorld - tStep; worldX <= tStartWorld + canvasW + tStep * 2; worldX += tStep) {
            const screenX = worldX - tParallaxOffset;
            const th = 60 + Math.sin(worldX * 0.02) * 25 + Math.cos(worldX * 0.035) * 15;
            ctx.lineTo(screenX, canvasH - th);
        }
        ctx.lineTo(canvasW, canvasH);
        ctx.fill();
    }

    drawPlatform(ctx, plat, camX) {
        const dx = plat.x - camX;
        const dy = plat.y;

        if (dx + plat.w < -50 || dx > 1010) return;

        switch (plat.type) {
            case 'ground': {

                ctx.fillStyle = '#3a2510';
                ctx.fillRect(dx, dy, plat.w, plat.h);

                ctx.fillStyle = '#3a7a2a';
                ctx.fillRect(dx, dy, plat.w, 6);

                ctx.fillStyle = '#4a3518';
                for (let gx = 0; gx < plat.w; gx += 32) {
                    ctx.fillRect(dx + gx + 8, dy + 16, 4, 4);
                    ctx.fillRect(dx + gx + 20, dy + 28, 3, 3);
                }
                break;
            }
            case 'ceiling': {

                ctx.fillStyle = '#1a2030';
                ctx.fillRect(dx, dy, plat.w, plat.h);
                ctx.fillStyle = '#2a3040';
                ctx.fillRect(dx, dy + plat.h - 4, plat.w, 4);
                break;
            }
            case 'solar': {

                ctx.fillStyle = '#5a6a7a';
                ctx.fillRect(dx - 2, dy - 2, plat.w + 4, plat.h + 4);

                ctx.fillStyle = '#3a6aaa';
                ctx.fillRect(dx, dy, plat.w, plat.h);

                ctx.strokeStyle = '#2a5090';
                ctx.lineWidth = 1;
                for (let gx = 0; gx < plat.w; gx += 20) {
                    ctx.beginPath();
                    ctx.moveTo(dx + gx, dy);
                    ctx.lineTo(dx + gx, dy + plat.h);
                    ctx.stroke();
                }

                ctx.fillStyle = 'rgba(140, 180, 255, 0.3)';
                ctx.fillRect(dx, dy, plat.w, 4);

                ctx.fillStyle = '#4a5a6a';
                ctx.fillRect(dx + plat.w / 2 - 3, dy + plat.h, 6, 8);
                break;
            }
        }
    }

    drawCollectible(ctx, item, camX) {
        const dx = item.x - camX;
        const dy = item.y;
        if (dx + item.w < -20 || dx > 980) return;

        const bobOffset = Math.sin(this.animTimer * 0.06 + item.x * 0.1) * 3;

        if (item.type === 'silver') {

            const by = dy + bobOffset;

            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fillRect(dx - 1, dy + item.h + 2, item.w + 2, 3);

            ctx.fillStyle = '#b8c4d0';
            ctx.fillRect(dx, by, item.w, item.h);

            ctx.fillStyle = '#dce4ec';
            ctx.fillRect(dx + 2, by + 2, item.w - 6, 4);

            const shimmer = Math.sin(this.animTimer * 0.1 + item.x) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(255, 255, 255, ${shimmer * 0.4})`;
            ctx.fillRect(dx + 4, by + 2, 6, item.h - 4);

            ctx.fillStyle = '#6a7a8a';
            ctx.fillRect(dx + 8, by + 6, 6, 4);
        } else if (item.type === 'warta') {

            const by = dy + bobOffset;
            const sparkle = Math.sin(this.animTimer * 0.12 + item.x) * 0.3 + 0.7;

            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 10 * sparkle;

            ctx.fillStyle = `rgba(255, 215, 0, ${sparkle})`;
            ctx.beginPath();
            const cx = dx + item.w / 2;
            const cy = by + item.h / 2;
            ctx.moveTo(cx, cy - item.h / 2);
            ctx.lineTo(cx + item.w / 2, cy);
            ctx.moveTo(cx, cy - item.h / 2);
            ctx.lineTo(cx - item.w / 2, cy);
            ctx.lineTo(cx, cy + item.h / 2);
            ctx.lineTo(cx + item.w / 2, cy);
            ctx.fill();

            ctx.fillStyle = '#fff8dc';
            ctx.fillRect(cx - 3, cy - 3, 6, 6);

            ctx.shadowBlur = 0;
        }
    }

    drawHazard(ctx, hazard, camX) {
        const dx = hazard.x - camX;
        const dy = hazard.y;
        if (dx + hazard.w < -20 || dx > 980) return;

        const flicker = Math.random() > 0.3 ? 1 : 0.4;

        ctx.globalAlpha = flicker;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 12;

        ctx.fillStyle = '#1a1a2a';
        ctx.fillRect(dx, dy, hazard.w, hazard.h);

        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const startY = hazard.type === 'electric_ceiling' ? dy + hazard.h : dy;
        const endY = hazard.type === 'electric_ceiling' ? dy : dy + hazard.h;
        const midX = dx + hazard.w / 2;

        ctx.moveTo(midX - 6, startY);
        ctx.lineTo(midX + 4 + Math.random() * 4, (startY + endY) / 2 - 3);
        ctx.lineTo(midX - 4 - Math.random() * 4, (startY + endY) / 2 + 3);
        ctx.lineTo(midX + 6, endY);
        ctx.stroke();

        ctx.strokeStyle = '#80f0ff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(midX + 8, startY);
        ctx.lineTo(midX - 2 + Math.random() * 6, (startY + endY) / 2);
        ctx.lineTo(midX + 10, endY);
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }

    drawNPC(ctx, npc, camX) {
        const dx = npc.x - camX;
        const dy = npc.y;
        if (dx + npc.w < -20 || dx > 980) return;

        const floatY = Math.sin(this.animTimer * 0.04) * 4;

        if (!npc.quizDone) {
            ctx.shadowColor = '#4a8ef7';
            ctx.shadowBlur = 10;
        }

        ctx.fillStyle = npc.quizDone ? '#4a5a6a' : '#5a9af7';
        ctx.fillRect(dx, dy + floatY, npc.w, npc.h - 12);

        ctx.fillStyle = npc.quizDone ? '#5a6a7a' : '#7ab4ff';
        ctx.fillRect(dx + 2, dy + floatY - 8, npc.w - 4, 14);

        ctx.fillStyle = npc.quizDone ? '#3a4a5a' : '#00ff88';
        const eyeBlink = Math.sin(this.animTimer * 0.08) > 0.9 ? 1 : 4;
        ctx.fillRect(dx + npc.w / 2 - 4, dy + floatY - 4, 8, eyeBlink);

        ctx.fillStyle = '#8ab4f8';
        ctx.fillRect(dx + npc.w / 2 - 1, dy + floatY - 14, 2, 8);

        if (!npc.quizDone && Math.sin(this.animTimer * 0.1) > 0) {
            ctx.fillStyle = '#ff4444';
            ctx.fillRect(dx + npc.w / 2 - 2, dy + floatY - 16, 4, 4);
        }

        if (!npc.quizDone) {
            const flameH = 4 + Math.random() * 6;
            ctx.fillStyle = '#ff8844';
            ctx.fillRect(dx + 6, dy + floatY + npc.h - 12, 4, flameH);
            ctx.fillRect(dx + npc.w - 10, dy + floatY + npc.h - 12, 4, flameH);
            ctx.fillStyle = '#ffcc44';
            ctx.fillRect(dx + 7, dy + floatY + npc.h - 12, 2, flameH - 2);
            ctx.fillRect(dx + npc.w - 9, dy + floatY + npc.h - 12, 2, flameH - 2);
        }

        if (npc.quizDone) {
            ctx.fillStyle = '#3cdc7c';
            ctx.font = '14px "Press Start 2P"';
            ctx.fillText('✓', dx + 6, dy + floatY + 20);
        }

        ctx.shadowBlur = 0;
    }

    drawFinishGate(ctx, gate, camX) {
        const dx = gate.x - camX;
        const dy = gate.y;
        if (dx + gate.w < -20 || dx > 1000) return;

        ctx.fillStyle = '#5a6a8a';
        ctx.fillRect(dx, dy, 16, gate.h);
        ctx.fillStyle = '#7a8aaa';
        ctx.fillRect(dx + 2, dy + 4, 12, gate.h - 8);

        ctx.fillStyle = '#5a6a8a';
        ctx.fillRect(dx + gate.w - 16, dy, 16, gate.h);
        ctx.fillStyle = '#7a8aaa';
        ctx.fillRect(dx + gate.w - 14, dy + 4, 12, gate.h - 8);

        ctx.fillStyle = '#6a7a9a';
        ctx.fillRect(dx, dy, gate.w, 18);

        ctx.fillStyle = '#ffd700';
        ctx.font = '6px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText('BALAI', dx + gate.w / 2, dy + 8);
        ctx.fillText('ARGENTARA', dx + gate.w / 2, dy + 16);
        ctx.textAlign = 'left';

        const pulse = Math.sin(this.animTimer * 0.05) * 0.3 + 0.5;
        ctx.fillStyle = `rgba(255, 215, 0, ${pulse * 0.15})`;
        ctx.fillRect(dx + 16, dy + 18, gate.w - 32, gate.h - 18);
    }
}
