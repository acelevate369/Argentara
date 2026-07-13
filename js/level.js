

import { checkAABB } from './physics.js';

const QUIZ_DATA = [ // data soal kuis untuk npc robot
    {
        question: "Kenapa perak (Argentum) penting bagi industri panel surya?",
        options: [
            "A. Konduktor listrik terbaik di antara semua logam",
            "B. Hanya sebagai hiasan panel",
            "C. Untuk membuat panel lebih berat",
            "D. Tidak ada fungsi khusus"
        ],
        correctIndex: 0,
        explanation: "Benar! Perak memiliki konduktivitas listrik tertinggi di antara semua logam, sehingga sangat efisien untuk menghantarkan listrik yang dihasilkan panel surya."
    },
    {
        question: "Apa yang terjadi jika permintaan (demand) perak meningkat tapi pasokan (supply) tetap?",
        options: [
            "A. Harga perak turun",
            "B. Harga perak naik",
            "C. Harga perak tetap sama",
            "D. Perak menghilang dari pasar"
        ],
        correctIndex: 1,
        explanation: "Benar! Menurut hukum supply & demand, jika permintaan naik sedangkan pasokan tetap, maka harga akan naik. Ini yang terjadi pada perak karena meningkatnya industri energi surya dan teknologi."
    },
    {
        question: "Berapa persen perak dunia yang digunakan untuk industri (termasuk panel surya dan elektronik)?",
        options: [
            "A. Sekitar 10%",
            "B. Sekitar 25%",
            "C. Lebih dari 50%",
            "D. Kurang dari 5%"
        ],
        correctIndex: 2,
        explanation: "Benar! Lebih dari 50% produksi perak dunia digunakan untuk keperluan industri, termasuk panel surya, elektronik, dan peralatan medis. Ini menunjukkan pentingnya perak sebagai logam strategis."
    }
];

const WARTA_FACTS = [ // data fakta edukasi untuk bintang warta
    "PLTS (Pembangkit Listrik Tenaga Surya) membutuhkan perak sebagai konduktor di setiap selnya. Satu panel surya mengandung sekitar 20 gram perak!",
    "Indonesia memiliki potensi energi surya yang besar karena terletak di garis khatulistiwa. Permintaan perak untuk panel surya terus meningkat seiring target energi terbarukan nasional.",
    "Harga perak telah naik signifikan dalam dekade terakhir. Faktor utamanya: meningkatnya penggunaan di industri teknologi hijau dan terbatasnya cadangan tambang baru.",
    "Selain panel surya, perak juga digunakan dalam smartphone, laptop, kendaraan listrik, dan peralatan medis. Perak adalah logam paling konduktif yang ada!"
];

function createLevel1() { // generate data statis untuk level 1
    const TILE = 32;

    return {
        name: "Bukit Energi Hijau",
        mission: "Kumpulkan 4 Argen-bars & Hindari Korsleting!",
        width: 4200,
        height: 540,
        requiredBars: 4,
        playerSpawn: { x: 80, y: 400 },

        platforms: [ // kotak-kotak pijakan solid (x, y, w, h)

            { x: 0, y: 480, w: 700, h: 60, type: 'ground' },

            { x: 800, y: 480, w: 600, h: 60, type: 'ground' },

            { x: 1500, y: 480, w: 700, h: 60, type: 'ground' },

            { x: 2400, y: 480, w: 500, h: 60, type: 'ground' },
            { x: 3000, y: 480, w: 1200, h: 60, type: 'ground' },

            { x: 320, y: 430, w: 128, h: 20, type: 'solar' },
            { x: 520, y: 410, w: 128, h: 20, type: 'solar' },

            { x: 700, y: 430, w: 120, h: 20, type: 'solar' },
            { x: 860, y: 410, w: 130, h: 20, type: 'solar' },

            { x: 1550, y: 420, w: 160, h: 20, type: 'solar' },
            { x: 1780, y: 390, w: 140, h: 20, type: 'solar' },
            { x: 2000, y: 360, w: 160, h: 20, type: 'solar' },

            { x: 2500, y: 425, w: 140, h: 20, type: 'solar' },
            { x: 2700, y: 400, w: 120, h: 20, type: 'solar' },

            { x: 3200, y: 420, w: 160, h: 20, type: 'solar' },
            { x: 3500, y: 390, w: 140, h: 20, type: 'solar' },
        ],

        collectibles: [ // item yang bisa diambil (silver / bintang warta)

            { x: 370, y: 406, w: 20, h: 16, type: 'silver', collected: false },
            { x: 560, y: 386, w: 20, h: 16, type: 'silver', collected: false },
            { x: 1600, y: 396, w: 20, h: 16, type: 'silver', collected: false },
            { x: 1830, y: 366, w: 20, h: 16, type: 'silver', collected: false },
            { x: 2050, y: 336, w: 20, h: 16, type: 'silver', collected: false },
            { x: 3550, y: 366, w: 20, h: 16, type: 'silver', collected: false },

            { x: 200, y: 450, w: 20, h: 20, type: 'warta', collected: false, factIndex: 0 },
            { x: 1000, y: 450, w: 20, h: 20, type: 'warta', collected: false, factIndex: 1 },
            { x: 1900, y: 450, w: 20, h: 20, type: 'warta', collected: false, factIndex: 2 },
            { x: 3300, y: 450, w: 20, h: 20, type: 'warta', collected: false, factIndex: 3 },
        ],

        hazards: [ // rintangan listrik mematikan

            { x: 950, y: 456, w: 40, h: 24, type: 'electric_floor' },
            { x: 1700, y: 456, w: 40, h: 24, type: 'electric_floor' },
            { x: 2100, y: 456, w: 40, h: 24, type: 'electric_floor' },
            { x: 3400, y: 456, w: 40, h: 24, type: 'electric_floor' },
        ],

        npcs: [ // daftar posisi NPC untuk kuis
            {
                x: 2850, y: 432, w: 28, h: 48,
                type: 'quiz_robot',
                quizIndex: 0,
                quizDone: false,
                interactZone: { x: 2810, y: 400, w: 100, h: 80 }
            },
            {
                x: 3150, y: 432, w: 28, h: 48,
                type: 'quiz_robot',
                quizIndex: 1,
                quizDone: false,
                interactZone: { x: 3110, y: 400, w: 100, h: 80 }
            }
        ],

        finishGate: { x: 3900, y: 380, w: 80, h: 100 } // gerbang finish
    };
}

export class Level { // class manajer level dan renderer
    constructor() {
        this.data = null;
        this.animTimer = 0;
        this.particles = [];
    }

    load(levelNumber) { // muat data level berdasarkan nomor
        switch (levelNumber) {
            case 1:
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
        return QUIZ_DATA[index] || QUIZ_DATA[0];
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
