

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
            { x: 1080, y: 480, w: 1100, h: 60, type: 'ground' }, // Gap 80
            { x: 2260, y: 480, w: 1040, h: 60, type: 'ground' }, // Gap 80
            { x: 3380, y: 480, w: 1420, h: 60, type: 'ground' }, // Gap 80
            
            { x: 400, y: 340, w: 128, h: 20, type: 'solar' },
            { x: 600, y: 290, w: 128, h: 20, type: 'solar' },
            { x: 800, y: 340, w: 128, h: 20, type: 'solar' },
            { x: 1400, y: 340, w: 128, h: 20, type: 'solar' },
            { x: 1600, y: 290, w: 128, h: 20, type: 'solar' },
            { x: 1800, y: 240, w: 128, h: 20, type: 'solar' },
            { x: 2600, y: 340, w: 128, h: 20, type: 'solar' },
            { x: 2800, y: 290, w: 128, h: 20, type: 'solar' },
            { x: 3000, y: 340, w: 128, h: 20, type: 'solar' }
        ],
        collectibles: [
            { x: 450, y: 310, w: 20, h: 16, type: 'silver', collected: false }, // Di atas solar x=400,y=340
            { x: 850, y: 310, w: 20, h: 16, type: 'silver', collected: false }, // Di atas solar x=800,y=340
            { x: 1200, y: 450, w: 20, h: 16, type: 'silver', collected: false }, // Di tanah ground 2
            
            { x: 654, y: 260, w: 20, h: 20, type: 'warta', collected: false, factIndex: 0 }, // Di atas solar x=600,y=290
            { x: 1454, y: 310, w: 20, h: 20, type: 'warta', collected: false, factIndex: 1 }, // Di atas solar x=1400,y=340
            { x: 2654, y: 310, w: 20, h: 20, type: 'warta', collected: false, factIndex: 2 }, // Di atas solar x=2600,y=340
            { x: 1854, y: 210, w: 20, h: 20, type: 'warta', collected: false, factIndex: 3 }, // Di atas solar x=1800,y=240
            { x: 1654, y: 260, w: 20, h: 20, type: 'warta', collected: false, factIndex: 4 }, // Di atas solar x=1600,y=290
            { x: 2854, y: 260, w: 20, h: 20, type: 'warta', collected: false, factIndex: 5 }, // Di atas solar x=2800,y=290
            { x: 3054, y: 310, w: 20, h: 20, type: 'warta', collected: false, factIndex: 6 }  // Di atas solar x=3000,y=340
        ],
        hazards: [
            { x: 1000, y: 480, w: 80, h: 24, type: 'electric_floor' }, // Di jurang pertama
            { x: 2180, y: 480, w: 80, h: 24, type: 'electric_floor' }, // Di jurang kedua
            { x: 3800, y: 460, w: 100, h: 24, type: 'electric_floor' }  // Di jurang ketiga
        ],
        npcs: [
            { x: 550, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 0, quizDone: false, interactZone: { x: 510, y: 400, w: 100, h: 80 } },
            { x: 1540, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 1, quizDone: false, interactZone: { x: 1500, y: 400, w: 100, h: 80 } },
            { x: 2300, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 2, quizDone: false, interactZone: { x: 2260, y: 400, w: 100, h: 80 } }, // Dipindah agar tidak kena sengatan listrik di 2400
            { x: 2740, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 3, quizDone: false, interactZone: { x: 2700, y: 400, w: 100, h: 80 } },
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
            { x: 880, y: 480, w: 780, h: 60, type: 'ground' }, // Gap 80
            { x: 1740, y: 480, w: 900, h: 60, type: 'ground' }, // Gap 80
            { x: 2720, y: 480, w: 840, h: 60, type: 'ground' }, // Gap 80
            { x: 3640, y: 480, w: 1360, h: 60, type: 'ground' }, // Gap 80
            
            { x: 300, y: 360, w: 128, h: 20, type: 'solar' },
            { x: 550, y: 340, w: 128, h: 20, type: 'solar' },
            { x: 950, y: 320, w: 128, h: 20, type: 'solar' },
            { x: 1600, y: 360, w: 128, h: 20, type: 'solar' },
            { x: 2200, y: 340, w: 128, h: 20, type: 'solar' },
            { x: 2500, y: 320, w: 128, h: 20, type: 'solar' },
            { x: 3450, y: 360, w: 128, h: 20, type: 'solar' }
        ],
        collectibles: [
            { x: 354, y: 330, w: 20, h: 16, type: 'silver', collected: false }, 
            { x: 1654, y: 330, w: 20, h: 16, type: 'silver', collected: false }, 
            { x: 2254, y: 310, w: 20, h: 16, type: 'silver', collected: false }, 
            { x: 3504, y: 330, w: 20, h: 16, type: 'silver', collected: false }, 
            { x: 950, y: 450, w: 20, h: 16, type: 'silver', collected: false }, 
            
            { x: 604, y: 310, w: 20, h: 20, type: 'warta', collected: false, factIndex: 0 }, 
            { x: 1004, y: 290, w: 20, h: 20, type: 'warta', collected: false, factIndex: 1 }, 
            { x: 1400, y: 450, w: 20, h: 20, type: 'warta', collected: false, factIndex: 2 }, 
            { x: 1850, y: 450, w: 20, h: 20, type: 'warta', collected: false, factIndex: 3 }, 
            { x: 2554, y: 290, w: 20, h: 20, type: 'warta', collected: false, factIndex: 4 }, 
            { x: 2850, y: 450, w: 20, h: 20, type: 'warta', collected: false, factIndex: 5 }  
        ],
        hazards: [
            { x: 800, y: 480, w: 80, h: 24, type: 'electric_floor' },  // Di jurang pertama
            { x: 1660, y: 480, w: 80, h: 24, type: 'electric_floor' }, // Di jurang kedua
            { x: 2640, y: 480, w: 80, h: 24, type: 'electric_floor' }  // Di jurang ketiga
        ],
        npcs: [
            { x: 1300, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 0, quizDone: false, interactZone: { x: 1260, y: 400, w: 100, h: 80 } },
            { x: 2400, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 1, quizDone: false, interactZone: { x: 2360, y: 400, w: 100, h: 80 } },
            { x: 3300, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 2, quizDone: false, interactZone: { x: 3260, y: 400, w: 100, h: 80 } },
            { x: 4000, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 3, quizDone: false, interactZone: { x: 4260, y: 400, w: 100, h: 80 } },
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
            { x: 1080, y: 480, w: 860, h: 60, type: 'ground' }, // Gap 80
            { x: 2020, y: 480, w: 860, h: 60, type: 'ground' }, // Gap 80
            { x: 2960, y: 480, w: 2040, h: 60, type: 'ground' }, // Boss arena panjang
            
            { x: 400, y: 340, w: 64, h: 20, type: 'solar' },
            { x: 600, y: 290, w: 64, h: 20, type: 'solar' },
            { x: 800, y: 340, w: 64, h: 20, type: 'solar' },
            { x: 950, y: 290, w: 64, h: 20, type: 'solar' },
            { x: 1400, y: 340, w: 64, h: 20, type: 'solar' },
            
            // Boss Arena Platforms — 3 panel surya
            { x: 3800, y: 370, w: 128, h: 20, type: 'solar' },
            { x: 4100, y: 330, w: 128, h: 20, type: 'solar' },
            { x: 4400, y: 370, w: 128, h: 20, type: 'solar' }
        ],
        collectibles: [
            { x: 422, y: 310, w: 20, h: 20, type: 'warta', collected: false, factIndex: 0 }, // Di atas solar x=400,y=340
            { x: 622, y: 260, w: 20, h: 20, type: 'warta', collected: false, factIndex: 1 }, // Di atas solar x=600,y=290
            { x: 972, y: 260, w: 20, h: 20, type: 'warta', collected: false, factIndex: 2 }, // Di atas solar x=950,y=290
            { x: 1422, y: 310, w: 20, h: 20, type: 'warta', collected: false, factIndex: 3 }, // Di atas solar x=1400,y=340
            { x: 822, y: 310, w: 20, h: 20, type: 'warta', collected: false, factIndex: 4 }  // Di atas solar x=800,y=340
        ],
        hazards: [
            { x: 1000, y: 480, w: 80, h: 24, type: 'electric_floor' }, // Di jurang pertama
            { x: 1940, y: 480, w: 80, h: 24, type: 'electric_floor' }  // Di jurang kedua
        ],
        npcs: [
            { x: 800, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 0, quizDone: false, interactZone: { x: 860, y: 400, w: 100, h: 80 } },
            { x: 1600, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 1, quizDone: false, interactZone: { x: 1560, y: 400, w: 100, h: 80 } },
            { x: 2200, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 2, quizDone: false, interactZone: { x: 2160, y: 400, w: 100, h: 80 } }, // Dipindah dari x=2000 (jurang) ke tanah Ground 3
            { x: 2600, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 3, quizDone: false, interactZone: { x: 2560, y: 400, w: 100, h: 80 } },
            { x: 3300, y: 432, w: 28, h: 48, type: 'quiz_robot', quizIndex: 4, quizDone: false, interactZone: { x: 3260, y: 400, w: 100, h: 80 } },
            // Masyarakat setelah boss
            { x: 4700, y: 448, w: 20, h: 32, type: 'villager', color: '#ff6677' },
            { x: 4740, y: 448, w: 20, h: 32, type: 'villager', color: '#55cc88' },
            { x: 4770, y: 448, w: 20, h: 32, type: 'villager', color: '#7799ff' }
        ],
        finishGate: { x: 4900, y: 380, w: 80, h: 100 },
        hasBoss: true,
        bossArena: { x: 3600, width: 960 } // Kamera akan dikunci di sini sesuai resolusi 960x540
    };
}

export class Level { // class manajer level dan renderer
    constructor() {
        this.data = null;
        this.animTimer = 0;
        this.particles = [];
        this.decorations = [];

        // Load custom assets
        this.imgDirt = new Image();
        this.imgDirtProcessed = null;
        this.dirtPattern = null;
        this.imgDirt.onload = () => {
            const cropX = 140; // Potong lereng/tebing dari ujung gambar (140px) agar tengahnya benar-benar rata
            
            // Process center block (flat seamless ground)
            const canvasCenter = document.createElement('canvas');
            canvasCenter.width = this.imgDirt.width - cropX * 2;
            canvasCenter.height = this.imgDirt.height;
            const ctxCenter = canvasCenter.getContext('2d', { willReadFrequently: true });
            ctxCenter.drawImage(this.imgDirt, -cropX, 0);
            this.imgDirtProcessed = canvasCenter;
            
            // Process left edge block (left cliff slope)
            const canvasLeft = document.createElement('canvas');
            canvasLeft.width = cropX; canvasLeft.height = this.imgDirt.height;
            const ctxLeft = canvasLeft.getContext('2d', { willReadFrequently: true });
            ctxLeft.drawImage(this.imgDirt, 0, 0, cropX, this.imgDirt.height, 0, 0, cropX, this.imgDirt.height);
            this.imgDirtProcessedLeft = canvasLeft;
            
            // Process right edge block (right cliff slope)
            const canvasRight = document.createElement('canvas');
            canvasRight.width = cropX; canvasRight.height = this.imgDirt.height;
            const ctxRight = canvasRight.getContext('2d', { willReadFrequently: true });
            ctxRight.drawImage(this.imgDirt, this.imgDirt.width - cropX, 0, cropX, this.imgDirt.height, 0, 0, cropX, this.imgDirt.height);
            this.imgDirtProcessedRight = canvasRight;
            
            this.dirtPatternCenter = null;
            this.dirtPatternLeft = null;
            this.dirtPatternRight = null;
        };
        this.imgDirt.src = 'asset/dirt 4.png';

        this.imgBushes = new Image();
        this.imgBushes.src = 'asset/bushes 2.png';

        this.imgSolar = new Image();
        this.imgSolar.src = 'asset/panel surya 3.png';
        
        this.imgCloud1 = new Image();
        this.imgCloud1.src = 'asset/Cloud 1.png';
        
        this.imgCloud2 = new Image();
        this.imgCloud2.src = 'asset/Cloud 2.png';
        
        // Custom BGs untuk Level 2 dan 3
        this.bgL2Far = new Image(); this.bgL2Far.src = 'asset/level2_far.png';
        this.bgL2Near = new Image(); this.bgL2Near.src = 'asset/level2_near.png';
        this.bgL3Far = new Image(); this.bgL3Far.src = 'asset/level3_far.png';
        this.bgL3Near = new Image(); this.bgL3Near.src = 'asset/level3_near.png';
        
        this.imgMountainFar = new Image();
        this.imgMountainFar.src = 'asset/bg_mountains_far.png';
        
        this.imgSuro = [new Image(), new Image()];
        this.imgSuro[0].src = 'asset/utama/suro & boyo/Cak suro 1.png';
        this.imgSuro[1].src = 'asset/utama/suro & boyo/Cak suro 2.png';

        this.imgBaya = [new Image(), new Image()];
        this.imgBaya[0].src = 'asset/utama/suro & boyo/Cak baya 1.png';
        this.imgBaya[1].src = 'asset/utama/suro & boyo/Cak baya 2.png';
        
        const processBg = (img, cropPercent, fadePercent = 0.15, tint = null) => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            ctx.drawImage(img, 0, 0);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;
            
            const cropY = canvas.height * cropPercent;
            const fadeY = canvas.height * (cropPercent + fadePercent);

            const bgR = data[0], bgG = data[1], bgB = data[2], bgA = data[3];
            const isAlreadyTransparent = (bgA === 0);
            
            for (let x = 0; x < canvas.width; x++) {
                for (let y = 0; y < canvas.height; y++) {
                    const i = (y * canvas.width + x) * 4;
                    
                    if (!isAlreadyTransparent) {
                        if (y <= cropY) {
                            data[i+3] = 0; // Transparan penuh di atas
                        } else if (y <= fadeY && fadePercent > 0) {
                            // Smooth fade transition
                            const ratio = (y - cropY) / (fadeY - cropY);
                            data[i+3] = Math.floor(255 * (ratio * ratio)); 
                        }
                    }
                    
                    // Bersihkan solid color fallback (jika ada) dan terapkan Tint
                    if (data[i+3] > 0) {
                        const r = data[i], g = data[i+1], b = data[i+2];
                        
                        if (!isAlreadyTransparent) {
                            if ((Math.abs(r - bgR) < 30 && Math.abs(g - bgG) < 30 && Math.abs(b - bgB) < 30) || 
                                (r > 200 && g < 100 && b > 200)) { 
                                data[i+3] = 0; // Transparan
                            } else if (tint) {
                                // Terapkan pewarnaan (Tint) agar nyatu sama environment
                                data[i] = Math.min(255, r * tint.r);
                                data[i+1] = Math.min(255, g * tint.g);
                                data[i+2] = Math.min(255, b * tint.b);
                            }
                        }
                    }
                }
            }
            ctx.putImageData(imgData, 0, 0);
            return canvas;
        };

        this.bgL2NearProcessed = null;
        this.bgL2Near.onload = () => { this.bgL2NearProcessed = processBg(this.bgL2Near, 0.4, 0.15); };
        
        this.bgL3NearProcessed = null;
        this.bgL3Near.onload = () => { 
            // Level 3 (Atap): Potong paksa langitnya (0.47) tanpa fade biar bersih, lalu tint jadi oranye senja
            this.bgL3NearProcessed = processBg(this.bgL3Near, 0.47, 0, {r: 1.4, g: 0.8, b: 0.7}); 
        };

        this.imgMountainNear = new Image();
        this.imgMountainNearProcessed = null;
        this.imgMountainNear.onload = () => { this.imgMountainNearProcessed = processBg(this.imgMountainNear, 0.55, 0); };
        this.imgMountainNear.src = 'asset/bg_mountains_near.png';
        
        const loadStatue = (src) => {
            const img = new Image();
            img.processedCanvas = null;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d', { willReadFrequently: true });
                ctx.drawImage(img, 0, 0);
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imgData.data;
                const bgR = data[0], bgG = data[1], bgB = data[2], bgA = data[3];
                const isAlreadyTransparent = (bgA === 0);
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i], g = data[i+1], b = data[i+2];
                    if (!isAlreadyTransparent && 
                        ((Math.abs(r - bgR) < 30 && Math.abs(g - bgG) < 30 && Math.abs(b - bgB) < 30) || 
                        (r > 200 && g < 100 && b > 200))) { 
                        data[i+3] = 0; 
                    }
                }
                ctx.putImageData(imgData, 0, 0);
                img.processedCanvas = canvas;
            };
            img.src = src;
            return img;
        };
        
        this.imgStatue1 = loadStatue('asset/sura_baya_statue.png');
        this.imgStatueSiluet = loadStatue('asset/sura_baya_statue._Siluet.png');
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
        
        // Generate random easter egg statues (posisi X disesuaikan panjang map)
        this.statueInstances = [];
        const numStatues = 1; // Hanya spawn 1 patung per level sebagai easter egg langka
        for (let i = 0; i < numStatues; i++) {
            this.statueInstances.push({
                x: 200 + Math.random() * (this.data.width - 400), // Random sepanjang map
                scale: 0.12 + Math.random() * 0.15,
                yOffset: 120 + Math.random() * 60 // Diturunkan drastis agar mendarat di tanah/di belakang pabrik
            });
        }
        this.animTimer = 0;
        this.particles = [];
        this.dirtPattern = null; // Reset pattern so it recreates if needed

        // Generate decorations (bushes) along ground platforms
        this.decorations = [];
        for (const p of this.data.platforms) {
            if (p.type === 'ground') {
                const numBushes = Math.floor(p.w / 350); // Dikurangi jumlah semaknya biar ga aneh
                for (let i = 0; i < numBushes; i++) {
                    const bw = 60 + Math.random() * 20;
                    const bx = p.x + 30 + Math.random() * (p.w - 100);

                    // Kalkulasi jarak: Jangan ada bush di dekat Cak Sura / Cak Baya
                    let tooClose = false;
                    for (const npc of this.data.npcs) {
                        const dist = Math.abs((bx + bw / 2) - (npc.x + npc.w / 2));
                        if (dist < 180) { // Jarak aman sekitar 3-4 blok dari NPC
                            tooClose = true;
                            break;
                        }
                    }

                    // Hindari nempel banget sama tempat spawn player
                    if (Math.abs((bx + bw / 2) - this.data.playerSpawn.x) < 100) {
                        tooClose = true;
                    }
                    
                    // Hindari nutupin warta atau silver
                    for (const col of this.data.collectibles) {
                        if (col.type === 'warta' || col.type === 'silver') {
                            const dist = Math.abs((bx + bw / 2) - (col.x + col.w / 2));
                            if (dist < 100) { // Jarak aman dari barang yang bisa diambil
                                tooClose = true;
                                break;
                            }
                        }
                    }
                    
                    // Hindari nutupin hazard (sengatan listrik)
                    if (this.data.hazards) {
                        for (const hazard of this.data.hazards) {
                            const dist = Math.abs((bx + bw / 2) - (hazard.x + hazard.w / 2));
                            if (dist < 100) { // Jarak aman dari hazard
                                tooClose = true;
                                break;
                            }
                        }
                    }

                    if (!tooClose) {
                        const bh = 40 + Math.random() * 10;
                        this.decorations.push({
                            x: bx,
                            // Tambah offset +12 karena gambar bush memiliki ruang kosong (transparan) di bagian bawah
                            y: p.y - bh + 12, 
                            w: bw,
                            h: bh
                        });
                    }
                }
            }
        }
        
        // Generate clouds (awan) - jumlah terbatas
        this.clouds = [];
        const numClouds = Math.max(3, Math.floor(this.data.width / 600)); 
        for (let i = 0; i < numClouds; i++) {
            this.clouds.push({
                x: Math.random() * this.data.width,
                y: 10 + Math.random() * 120,
                w: 120 + Math.random() * 80,
                h: 60 + Math.random() * 40,
                type: Math.random() > 0.5 ? 1 : 2, // 1 for Cloud 1, 2 for Cloud 2
                speed: 0.1 + Math.random() * 0.2
            });
        }
    }

    checkInteractions(player) { // cek collision player dengan item/rintangan/npc
        const events = [];

        // Buat hitbox visual yang lebih besar dari hitbox fisika (karena hitbox fisika cuma di kaki)
        // Hitbox visual mengikuti ukuran gambar 90x90
        const playerVisualBox = {
            x: player.x - 33,
            y: player.y - 43,
            w: 90,
            h: 90
        };

        for (const item of this.data.collectibles) {
            // Gunakan playerVisualBox agar kepala nyentuh bintang langsung keambil
            if (!item.collected && checkAABB(playerVisualBox, item)) {
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
            // Untuk hazard (listrik dll) tetap gunakan hitbox fisik inti agar fair (tidak mudah mati)
            if (checkAABB(player, hazard)) {
                events.push({ type: 'hit_hazard', data: hazard });
            }
        }

        for (const npc of this.data.npcs) {
            // Skip NPCs tanpa interactZone (contoh: villager di Level 3)
            if (!npc.interactZone) continue;
            // Gunakan playerVisualBox untuk interaksi NPC agar lebih responsif
            if (!npc.quizDone && checkAABB(playerVisualBox, npc.interactZone)) {
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

        // Draw bushes behind collectibles/NPCs/player
        if (this.imgBushes.complete) {
            for (const decor of this.decorations) {
                const dx = decor.x - camX;
                if (dx + decor.w < -50 || dx > 1050) continue;
                ctx.drawImage(this.imgBushes, dx, decor.y, decor.w, decor.h);
            }
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

        let imgFar = null;
        let imgNear = null;
        
        if (this.levelNumber === 2) {
            imgFar = this.bgL2Far;
            imgNear = this.bgL2NearProcessed;
        } else if (this.levelNumber === 3) {
            imgFar = this.bgL3Far;
            imgNear = this.bgL3NearProcessed;
        } else {
            imgFar = this.imgMountainFar;
            imgNear = this.imgMountainNearProcessed;
        }

        // Latar langit solid (Sangat ringan, tidak bikin lag)
        ctx.fillStyle = '#87CEFA'; 
        if (this.levelNumber === 2) ctx.fillStyle = '#657065'; // Langit mendung pabrik
        if (this.levelNumber === 3) ctx.fillStyle = '#3a1e3a'; // Langit ungu boss
        ctx.fillRect(0, -50, canvasW, canvasH + 100);

        // Pegunungan jauh (Parallax layer 1) dengan patung Sura Baya
        if (imgFar && (imgFar.complete || imgFar.tagName === 'CANVAS') && imgFar.width > 0) {
            const mRate = 0.15;
            const bgW = imgFar.width || 1024;
            const bgH = imgFar.height || 1024;
            const scale = canvasH / bgH;
            const drawW = bgW * scale;
            const drawH = canvasH + 100;
            
            const baseTileIndex = Math.floor((camX * mRate) / drawW);
            const offset = (camX * mRate) % drawW;
            const numTiles = Math.ceil(canvasW / drawW) + 1;
            
            for (let i = 0; i < numTiles; i++) {
                const worldTileIndex = baseTileIndex + i;
                const tileX = Math.floor(-offset + (i * drawW));
                
                if (worldTileIndex % 2 !== 0 && this.levelNumber === 1) {
                    // Cermin horizontal agar tile menyambung sempurna tanpa garis potong (seamless)
                    // HANYA untuk Level 1 karena gambar dari asetnya butuh dicermin. Level 2 & 3 sudah native seamless.
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.drawImage(imgFar, -tileX - drawW, -50, drawW + 1, drawH);
                    ctx.restore();
                } else {
                    ctx.drawImage(imgFar, tileX, -50, drawW + 1, drawH);
                }
            }
        } else if (this.levelNumber === 1) {
            // Fallback original drawing if image fails (HANYA LEVEL 1)
            ctx.fillStyle = '#659B76';
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
        }

        // Gambar Patung Sura Baya (Digambar di luar blok imgFar agar selalu muncul meskipun fallback)
        if (this.levelNumber === 1 && this.imgStatue1.processedCanvas) {
            // Level 1: Patung asli, posisi fixed di tanah
            const statW = this.imgStatue1.processedCanvas.width * 0.12; // Dikecilkan dikit
            const statH = this.imgStatue1.processedCanvas.height * 0.12; // Dikecilkan dikit
            const statuePositions = [300, 4500, 9500]; 
            const mRate = 0.15; // Pastikan mRate tersedia
            for (const posX of statuePositions) {
                const drawX = posX - (camX * mRate);
                if (drawX + statW > -100 && drawX < canvasW + 100) {
                    ctx.drawImage(this.imgStatue1.processedCanvas, drawX, canvasH - statH - 230, statW, statH); // Dinaikkan dikit
                }
            }
        } else if (this.levelNumber !== 1 && this.imgStatueSiluet.processedCanvas) {
            // Level 2 & 3: Patung siluet, easter egg random melayang di atas background
            const mRate = 0.15; // Pastikan mRate tersedia
            for (const stat of this.statueInstances) {
                const statW = this.imgStatueSiluet.processedCanvas.width * stat.scale;
                const statH = this.imgStatueSiluet.processedCanvas.height * stat.scale;
                const drawX = stat.x - (camX * mRate);
                // Pastikan digambar hanya jika masuk layar
                if (drawX + statW > -100 && drawX < canvasW + 100) {
                    ctx.drawImage(this.imgStatueSiluet.processedCanvas, drawX, canvasH - statH - stat.yOffset, statW, statH);
                }
            }
        }

        // Kabut Atmosferik pemisah layar belakang dan depan (Depth Haze)
        ctx.fillStyle = this.levelNumber === 1 ? 'rgba(135, 206, 250, 0.15)' :
                        this.levelNumber === 2 ? 'rgba(101, 112, 101, 0.3)' :
                                                 'rgba(58, 30, 58, 0.4)';
        ctx.fillRect(0, -50, canvasW, canvasH + 100);

        // Pegunungan dekat (Parallax layer 2)
        if (imgNear && (imgNear.width > 0 || imgNear.tagName === 'CANVAS')) {
            const tRate = 0.3;
            const bgW = imgNear.width || 1024;
            const bgH = imgNear.height || 1024;
            const scale = canvasH / bgH;
            const drawW = bgW * scale;
            const drawH = canvasH + 100;
            
            const baseTileIndex = Math.floor((camX * tRate) / drawW);
            const offset = (camX * tRate) % drawW;
            const numTiles = Math.ceil(canvasW / drawW) + 1;
            
            // Optimization: No globalAlpha for full screen image drawing to avoid extreme lag (Fill Rate drop)
            
            for (let i = 0; i < numTiles; i++) {
                const worldTileIndex = baseTileIndex + i;
                const tileX = Math.floor(-offset + (i * drawW));
                
                if (worldTileIndex % 2 !== 0 && this.levelNumber === 1) {
                    // Cermin horizontal untuk seamless (HANYA LEVEL 1)
                    ctx.save();
                    ctx.scale(-1, 1);
                    ctx.drawImage(imgNear, -tileX - drawW, -50, drawW + 1, drawH);
                    ctx.restore();
                } else {
                    ctx.drawImage(imgNear, tileX, -50, drawW + 1, drawH);
                }
            }
        } else if (this.levelNumber === 1) {
            // Fallback original drawing if image fails (HANYA LEVEL 1)
            ctx.fillStyle = '#488056';
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

        // Misty Ground Fog (Digambar di BELAKANG platform agar warna platform tidak mati)
        const fogGrad = ctx.createLinearGradient(0, canvasH - 200, 0, canvasH);
        fogGrad.addColorStop(0, 'rgba(0,0,0,0)');
        if (this.levelNumber === 1) fogGrad.addColorStop(1, 'rgba(150, 200, 150, 0.25)'); // Jauh lebih tipis & lebih cerah (tidak bikin kusam)
        else if (this.levelNumber === 2) fogGrad.addColorStop(1, 'rgba(100, 120, 100, 0.3)');
        else fogGrad.addColorStop(1, 'rgba(80, 50, 80, 0.4)');
        ctx.fillStyle = fogGrad;
        ctx.fillRect(0, canvasH - 200, canvasW, 200);
    }

    drawPlatform(ctx, plat, camX) {
        const dx = plat.x - camX;
        const dy = plat.y;

        if (dx + plat.w < -50 || dx > 1010) return;

        switch (plat.type) {
            case 'ground': {
                if (this.imgDirtProcessed || this.imgDirt.complete) {
                    if (!this.dirtPatternCenter) {
                        this.dirtPatternCenter = ctx.createPattern(this.imgDirtProcessed || this.imgDirt, 'repeat');
                        if (this.imgDirtProcessedLeft) {
                            this.dirtPatternLeft = ctx.createPattern(this.imgDirtProcessedLeft, 'repeat');
                            this.dirtPatternRight = ctx.createPattern(this.imgDirtProcessedRight, 'repeat');
                        }
                    }
                    const cropX = 140;
                    
                    // Smart cliff detection: cek apakah ada ground yang langsung berbatasan di kiri/kanan
                    // Kalau ada gap (jurang), tampilkan cliff edge. Kalau nyambung, skip cliff.
                    let hasGapLeft = true;
                    let hasGapRight = true;
                    
                    for (const otherPlat of this.data.platforms) {
                        if (otherPlat === plat || otherPlat.type !== 'ground') continue;
                        // Cek apakah ada platform yang ujung kanannya menyentuh ujung kiri platform ini
                        if (Math.abs((otherPlat.x + otherPlat.w) - plat.x) < 2) {
                            hasGapLeft = false;
                        }
                        // Cek apakah ada platform yang ujung kirinya menyentuh ujung kanan platform ini
                        if (Math.abs(otherPlat.x - (plat.x + plat.w)) < 2) {
                            hasGapRight = false;
                        }
                    }
                    
                    // Platform dimulai dari x=0 (awal dunia) → tidak perlu cliff kiri
                    if (plat.x <= 0) hasGapLeft = false;
                    
                    const leftEdgeW = hasGapLeft ? cropX : 0;
                    const rightEdgeW = hasGapRight ? cropX : 0;
                    
                    // Render left cliff edge (hanya jika ada jurang di kiri)
                    if (hasGapLeft && this.dirtPatternLeft) {
                        ctx.save();
                        ctx.translate(dx, dy);
                        ctx.fillStyle = this.dirtPatternLeft;
                        ctx.fillRect(0, 0, cropX, 400); 
                        ctx.restore();
                    }
                    
                    // Render center seamless repeating
                    ctx.save();
                    ctx.translate(dx + leftEdgeW, dy);
                    ctx.fillStyle = this.dirtPatternCenter;
                    ctx.fillRect(0, 0, plat.w - leftEdgeW - rightEdgeW, 400); 
                    ctx.restore();
                    
                    // Render right cliff edge (hanya jika ada jurang di kanan)
                    if (hasGapRight && this.dirtPatternRight) {
                        ctx.save();
                        ctx.translate(dx + plat.w - cropX, dy);
                        ctx.fillStyle = this.dirtPatternRight;
                        ctx.fillRect(0, 0, cropX, 400); 
                        ctx.restore();
                    }
                    
                    // Draw a top grass edge for blending
                    ctx.fillStyle = 'rgba(74, 115, 42, 0.4)';
                    ctx.fillRect(dx, dy, plat.w, 4);
                } else {
                    // Fallback to original drawing if image not loaded
                    ctx.fillStyle = '#3a2510';
                    ctx.fillRect(dx, dy, plat.w, plat.h);
                    ctx.fillStyle = '#3a7a2a';
                    ctx.fillRect(dx, dy, plat.w, 6);
                    ctx.fillStyle = '#4a3518';
                    for (let gx = 0; gx < plat.w; gx += 32) {
                        ctx.fillRect(dx + gx + 8, dy + 16, 4, 4);
                        ctx.fillRect(dx + gx + 20, dy + 28, 3, 3);
                    }
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
                if (this.imgSolar.complete) {
                    const cols = 4;
                    const rows = 1; // Panel surya 3.png hanya 1 baris
                    const frameW = this.imgSolar.width / cols;
                    const frameH = this.imgSolar.height / rows;
                    
                    const frameIndex = Math.floor(this.animTimer / 12) % cols;
                    const sx = frameIndex * frameW;
                    const sy = 0;
                    
                    // Supaya gambar tidak kebesaran, kita tile (jejerkan) panelnya secara horizontal
                    // Target lebar per panel sekitar 64px
                    const numTiles = Math.max(1, Math.round(plat.w / 64));
                    const drawW = plat.w / numTiles;
                    const drawH = drawW * (frameH / frameW); 
                    
                    // Kita geser visualnya naik sedikit (-4 pixel) agar kaki player
                    // benar-benar menapak di ujung panel, tidak melayang.
                    const drawY = dy - 4;
                    
                    // Titik potong (Y) antara body panel dan api pendorong.
                    // Tinggi gambar 262, kita potong di 200px supaya moncong/nozzle-nya ikut diam!
                    const splitY = 200; 
                    const staticSx = 0; // Body panel selalu pakai frame 0 biar gak goyang (statis)

                    for (let i = 0; i < numTiles; i++) {
                        const tileDx = dx + (i * drawW);
                        
                        // 1. Gambar Body Panel (Statis, anti-goyang)
                        ctx.drawImage(
                            this.imgSolar,
                            staticSx, 0, frameW, splitY,
                            tileDx, drawY, drawW, drawW * (splitY / frameW)
                        );
                        
                        // 2. Gambar Api Pendorong
                        // Karena sprite aslinya memiliki titik tengah api yang bergeser-geser 
                        // di setiap frame (yang bikin goyang kanan-kiri), kita kunci di frame 0
                        // lalu kita animasikan skala tingginya saja (pulsing) agar terlihat hidup tapi tetap stabil 100%.
                        const flameAnimScale = 0.85 + Math.sin(this.animTimer * 0.4 + i) * 0.15;
                        const flameDrawH = drawW * ((frameH - splitY) / frameW) * flameAnimScale;
                        
                        ctx.drawImage(
                            this.imgSolar,
                            staticSx, splitY, frameW, frameH - splitY,
                            tileDx, drawY + drawW * (splitY / frameW), drawW, flameDrawH
                        );
                    }
                } else {
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
                }
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
        const startX = dx;
        const endX = dx + hazard.w;
        const midY = dy + hazard.h / 2;

        ctx.moveTo(startX, midY - 6);
        ctx.lineTo((startX + endX) / 2 - 3, midY + 4 + Math.random() * 4);
        ctx.lineTo((startX + endX) / 2 + 3, midY - 4 - Math.random() * 4);
        ctx.lineTo(endX, midY + 6);
        ctx.stroke();

        ctx.strokeStyle = '#80f0ff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(startX, midY + 8);
        ctx.lineTo((startX + endX) / 2, midY - 2 + Math.random() * 6);
        ctx.lineTo(endX, midY + 10);
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }

    drawNPC(ctx, npc, camX) {
        const dx = npc.x - camX;
        const dy = npc.y;
        if (dx + npc.w < -20 || dx > 980) return;

        const floatY = Math.sin(this.animTimer * 0.04) * 4;

        if (npc.type === 'villager') {
            ctx.fillStyle = npc.color;
            ctx.fillRect(dx, dy + 16, npc.w, npc.h - 16);
            ctx.fillStyle = '#ffccaa'; // Wajah
            ctx.fillRect(dx + 2, dy + 6, npc.w - 4, 10);
            
            // Animasi loncat
            if (Math.sin(this.animTimer * 0.2 + npc.x) > 0.8) {
                ctx.fillStyle = npc.color;
                ctx.fillRect(dx - 2, dy + 4, 4, 8); // Tangan atas
                ctx.fillRect(dx + npc.w - 2, dy + 4, 4, 8);
            } else {
                ctx.fillStyle = npc.color;
                ctx.fillRect(dx - 2, dy + 16, 4, 8); // Tangan bawah
                ctx.fillRect(dx + npc.w - 2, dy + 16, 4, 8);
            }
            return;
        }

        const isSuro = npc.quizIndex % 2 === 0;
        const sprites = isSuro ? this.imgSuro : this.imgBaya;
        const frameIdx = Math.floor(this.animTimer / 30) % 2;
        const img = sprites[frameIdx];

        if (img && img.complete) {
            const drawW = 90;
            const drawH = 90;
            const imgX = dx + npc.w / 2 - drawW / 2;
            const imgY = dy + npc.h - drawH + 10;
            
            if (npc.quizDone) {
                ctx.filter = 'brightness(50%)'; // Gelapkan jika kuis sudah dijawab
            } else {
                ctx.shadowColor = '#4a8ef7';
                ctx.shadowBlur = 10;
            }

            ctx.drawImage(img, imgX, imgY, drawW, drawH);

            ctx.filter = 'none';
            ctx.shadowBlur = 0;

            if (!npc.quizDone) {
                ctx.fillStyle = '#ffcc44';
                ctx.font = "bold 24px 'Courier New', monospace";
                ctx.fillText("?", dx + npc.w / 2 - 8, dy - 10 + Math.sin(this.animTimer * 0.1) * 5);
            }
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
