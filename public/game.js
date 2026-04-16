const GameState = { PLAYING: 'PLAYING', SYSTEM_OVERRIDE: 'SYSTEM_OVERRIDE', VALIDATING: 'VALIDATING' };
const REGISTRY_TEAM_ID = 'teamId'; const REGISTRY_MODULE = 'curModule'; const REGISTRY_SUBLEVEL = 'curSublevel';

let globalPlayerCount = 1;

class BootScene extends Phaser.Scene {
    constructor() { super('BootScene'); }
    preload() {
        console.log("Loading Retro Assets...");
        this.load.spritesheet('p1', 'assets/sprites/player1.png', { frameWidth: 32, frameHeight: 32 });

        this.load.image('bg0', 'assets/backgrounds/BACKGROUND.png');
        this.load.image('bg1', 'assets/backgrounds/WOODS_Fourth.png');
        this.load.image('bg2', 'assets/backgrounds/WOODS_Third.png');
        this.load.image('bg3', 'assets/backgrounds/WOODS_Second.png');
        this.load.image('bg4', 'assets/backgrounds/WOODS_First.png');
        this.load.image('bg5', 'assets/backgrounds/BUSH_BACKGROUND.png');
        this.load.image('bg6', 'assets/backgrounds/VINES_Second.png');

        this.load.spritesheet('woods_tiles', 'assets/tilesets/woods_tiles.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('portal', 'assets/objects/portal.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('spike', 'assets/objects/traps_spike.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('spike-sprite', 'assets/objects/spike-sprite.png');
        this.load.spritesheet('jump_pad', 'assets/objects/jump_pad.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('car', 'assets/objects/car.png');
        this.load.image('tyres', 'assets/objects/stacked_tyres.png');
        this.load.image('cone', 'assets/objects/traffic_cone.png');

        // MODULE 4: Space Shooter
        this.load.image('shooter_bg', 'assets/shooter/BG.png');
        this.load.image('asteroid', 'assets/shooter/asteroid_brown.png');
        this.load.image('plasma_1', 'assets/shooter/plasma_1.png');
        this.load.image('plasma_2', 'assets/shooter/plasma_2.png');
        // Enemies (Red & Green)
        this.load.image('enemy_o_m', 'assets/shooter/enemy_1_r_m.png');
        this.load.image('enemy_o_l', 'assets/shooter/enemy_1_r_l1.png');
        this.load.image('enemy_o_r', 'assets/shooter/enemy_1_r_r1.png');
        this.load.image('enemy_g_m', 'assets/shooter/enemy_1_g_m.png');
        this.load.image('enemy_g_l', 'assets/shooter/enemy_1_g_l1.png');
        this.load.image('enemy_g_r', 'assets/shooter/enemy_1_g_r1.png');
        // Player 1 (Red)
        this.load.image('p1_m', 'assets/shooter/player_r_m.png');
        this.load.image('p1_l', 'assets/shooter/player_r_l1.png');
        this.load.image('p1_r', 'assets/shooter/player_r_r1.png');
        // Player 2 (Blue)
        this.load.image('p2_m', 'assets/shooter/player_b_m.png');
        this.load.image('p2_l', 'assets/shooter/player_b_l1.png');
        this.load.image('p2_r', 'assets/shooter/player_b_r1.png');

        // MODULE 4 - SL2: Shooter Enemies
        ['r', 'g', 'b'].forEach(c => {
            this.load.image(`enemy2_${c}_m`, `assets/shooter/enemy_2_${c}_m.png`);
            this.load.image(`enemy2_${c}_l`, `assets/shooter/enemy_2_${c}_l1.png`);
            this.load.image(`enemy2_${c}_r`, `assets/shooter/enemy_2_${c}_r1.png`);
        });
        [1, 2, 3].forEach(i => this.load.image(`vulcan_${i}`, `assets/shooter/vulcan_${i}.png`));
        for(let i=1; i<=9; i++) this.load.image(`explosion_2_0${i}`, `assets/shooter/explosion_2_0${i}.png`);

        // MODULE 4 - SL3: Boss & Final Gear
        this.load.image('boss', 'assets/shooter/enemy_boss.png');
        [1, 2, 3].forEach(i => this.load.image(`proton_0${i}`, `assets/shooter/proton_0${i}.png`));
        for(let i=1; i<=9; i++) {
            this.load.image(`mine_${i}`, `assets/shooter/mine_11_0${i}.png`);
            this.load.image(`explosion_3_0${i}`, `assets/shooter/explosion_3_0${i}.png`);
        }

        // Vfx
        for(let i=1; i<=5; i++) this.load.image(`exhaust_0${i}`, `assets/shooter/exhaust_0${i}.png`);
        for(let i=1; i<=11; i++) {
            let n = i < 10 ? `0${i}` : i;
            this.load.image(`explosion_1_${n}`, `assets/shooter/explosion_1_${n}.png`);
        }
        
        // MODULE 2: Dynamic Jigsaw Assets
        this.load.spritesheet('puzzle_1', 'assets/images/beautiful-nature-landscape-top-hill_puzzle.png', { frameWidth: 130, frameHeight: 82 });
        this.load.image('puzzle_ref_1', 'assets/images/beautiful-nature-landscape-top-hill_puzzle.png');
        this.load.spritesheet('puzzle_2', 'assets/images/mountains-on-fire-800x594.png', { frameWidth: 100, frameHeight: 74 });
        this.load.image('puzzle_ref_2', 'assets/images/mountains-on-fire-800x594.png');
    }

    create() {
        // Setup Player 1 & 2 Animations Globally
        this.anims.create({ key: 'p1_idle', frames: this.anims.generateFrameNumbers('p1', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'p1_walk', frames: this.anims.generateFrameNumbers('p1', { start: 8, end: 13 }), frameRate: 15, repeat: -1 });
        this.anims.create({ key: 'p1_jump', frames: this.anims.generateFrameNumbers('p1', { start: 20, end: 23 }), frameRate: 10 });
        this.anims.create({ key: 'p1_death', frames: this.anims.generateFrameNumbers('p1', { start: 100, end: 109 }), frameRate: 15 });

        // Setup Portal, Spikes and Pads
        this.anims.create({ key: 'portal_swirl', frames: this.anims.generateFrameNumbers('portal'), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'spike_pop', frames: this.anims.generateFrameNumbers('spike', { start: 0, end: 13 }), frameRate: 20 });
        this.anims.create({ key: 'pad_active', frames: this.anims.generateFrameNumbers('jump_pad'), frameRate: 10, repeat: -1 });

        const storedId = localStorage.getItem('teamId');
        if (storedId) {
            fetch(`/api/teams/${storedId}/question`).then(r => r.json()).then(q => {
                this.registry.set(REGISTRY_TEAM_ID, storedId);
                this.registry.set(REGISTRY_MODULE, parseInt(q.current_level) || 1);
                this.registry.set(REGISTRY_SUBLEVEL, parseInt(q.current_sublevel) || 1);

                globalPlayerCount = parseInt(q.player_count) || parseInt(localStorage.getItem('playerCount')) || 1;

                const overlay = document.getElementById('login-overlay');
                if (overlay) overlay.classList.add('hidden');

                this.scene.start('UIScene'); // Skip Menu completely, recover session
            }).catch(() => this.scene.start('MenuScene'));
        } else {
            this.scene.start('MenuScene');
        }
    }
}

class MenuScene extends Phaser.Scene {
    constructor() { super('MenuScene'); }
    create() {
        const overlay = document.getElementById('login-overlay');
        overlay.classList.remove('hidden');

        const registerAndStart = (players) => {
            const name = document.getElementById('team-name-input').value;
            if (!name || name.trim() === '') return alert("Please enter Team Name");
            globalPlayerCount = players;

            fetch('/api/register', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ team_name: name.trim(), player_count: players })
            }).then(r => r.json()).then(data => {
                localStorage.setItem('teamId', data.team_id);
                localStorage.setItem('playerCount', players);
                this.registry.set(REGISTRY_TEAM_ID, data.team_id);

                fetch(`/api/teams/${data.team_id}/question`).then(r => r.json()).then(q => {
                    this.registry.set(REGISTRY_MODULE, parseInt(q.current_level) || 1);
                    this.registry.set(REGISTRY_SUBLEVEL, parseInt(q.current_sublevel) || 1);
                    overlay.classList.add('hidden');
                    this.scene.start('UIScene');
                });
            }).catch(e => alert("Backend error connecting"));
        };

        document.getElementById('btn-1player').onclick = () => registerAndStart(1);
        document.getElementById('btn-2player').onclick = () => registerAndStart(2);
    }
}

class UIScene extends Phaser.Scene {
    constructor() { super('UIScene'); }
    create() {
        this.currentState = GameState.PLAYING;
        this.modules = { 1: 'LevelDevilScene', 2: 'DataFragmentScene', 3: 'DriftRacingScene', 4: 'SpaceShooterScene', 5: 'SyncSurviveScene' };

        const { width, height } = this.scale;
        this.hudText = this.add.text(20, 20, '', { fontSize: '24px', fill: '#39ff14', fontFamily: 'Courier New', lineSpacing: 10 }).setShadow(0, 0, '#39ff14', 5);
        this.stateText = this.add.text(width - 20, 20, '', { fontSize: '20px', fill: '#ff00ea', fontFamily: 'Courier New' }).setOrigin(1, 0);

        this.setupHTMLOverlays();
        this.game.events.on('trigger-terminal', () => this.triggerSubLevelComplete());

        this.startActiveGameplayScene();
    }

    startActiveGameplayScene() {
        const curMod = parseInt(this.registry.get(REGISTRY_MODULE));
        const sceneToLoad = this.modules[curMod] || 'LevelDevilScene';
        this.updateHUD(sceneToLoad);
        this.scene.launch(sceneToLoad);
        this.scene.bringToTop('UIScene');
        this.activeGameplayScene = sceneToLoad;
        this.startTime = Date.now();
    }

    update() { this.updateHUD(this.activeGameplayScene); }

    updateHUD(sceneName) {
        let mod = parseInt(this.registry.get(REGISTRY_MODULE));
        let sub = parseInt(this.registry.get(REGISTRY_SUBLEVEL));
        let mode = globalPlayerCount === 1 ? '1 PLAYER SOLO' : '2 PLAYER CO-OP';
        this.hudText.setText(`[ MODE: ${mode} ]\nMODULE: ${mod} / SUBLEVEL: 0${sub}`);
        this.stateText.setText(`SYSTEM CORE: ${this.currentState}`);
    }

    triggerSubLevelComplete() {
        if (this.currentState !== GameState.PLAYING) return;
        this.currentState = GameState.SYSTEM_OVERRIDE;

        const activeScene = this.scene.get(this.activeGameplayScene);
        if (activeScene && activeScene.physics && activeScene.physics.world) activeScene.physics.world.pause();
        if (activeScene && activeScene.scene) activeScene.scene.pause();

        this.fetchQuestionText();

        const terminal = document.getElementById('compile-clash-terminal');
        terminal.classList.remove('hidden');
        terminal.classList.add('terminal-anim-slide-in');

        document.getElementById('command-input').value = '';
        document.getElementById('next-level-container').classList.add('hidden');
        document.getElementById('submit-code-btn').disabled = false;
        document.getElementById('terminal-body').innerHTML = `<p class="sys-msg">> TEAM HALTED. AWAITING DECRYPTION KEY...</p>`;
    }

    appendToTerminal(text, className = '') {
        const body = document.getElementById('terminal-body');
        const p = document.createElement('p'); p.innerText = text;
        if (className) p.className = className;
        body.appendChild(p); body.scrollTop = body.scrollHeight;
    }

    fetchQuestionText() {
        let id = this.registry.get(REGISTRY_TEAM_ID);
        fetch(`/api/teams/${id}/question`).then(res => res.json()).then(data => {
            if (data.error) this.appendToTerminal(`> ERROR: ${data.error}`, 'error-msg');
            else this.appendToTerminal(`> QUERY PROTOCOL: ${data.question_text}`, 'sys-msg');
        });
    }

    setupHTMLOverlays() {
        if (this.uiBinded) return;
        const submitBtn = document.getElementById('submit-code-btn');
        const nextLevelBtn = document.getElementById('next-level-btn');
        const inputField = document.getElementById('command-input');

        inputField.addEventListener('keydown', (e) => e.stopPropagation());
        inputField.addEventListener('keyup', (e) => e.stopPropagation());
        inputField.addEventListener('keypress', (e) => e.stopPropagation());

        submitBtn.onclick = () => {
            if (this.currentState !== GameState.SYSTEM_OVERRIDE) return;
            const code = inputField.value;
            if (!code.trim()) return;

            this.currentState = GameState.VALIDATING;
            submitBtn.disabled = true;
            this.appendToTerminal(`> UPLOADING LOCAL LOGIC...`);

            let id = this.registry.get(REGISTRY_TEAM_ID);
            const duration_seconds = Math.floor((Date.now() - this.startTime) / 1000);

            fetch(`/api/teams/${id}/submit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ submission: code }) })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        this.appendToTerminal(`> [VERIFIED] ${data.message}`, 'sys-msg');
                        document.getElementById('next-level-container').classList.remove('hidden');

                        let curSub = parseInt(this.registry.get(REGISTRY_SUBLEVEL));
                        let curMod = parseInt(this.registry.get(REGISTRY_MODULE));
                        let newSub = curSub + 1;
                        let newLevel = curMod;

                        if (newSub > 3) { newSub = 1; newLevel++; }
                        if (newLevel > 5) { newLevel = 5; newSub = 1; }

                        this.registry.set('nextSub', newSub);
                        this.registry.set('nextMod', newLevel);

                        fetch(`/api/teams/${id}/progress`, {
                            method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ new_level: newLevel, new_sublevel: newSub, score_increment: 100, duration_seconds })
                        });
                    } else {
                        this.appendToTerminal(`> [REJECTED] ${data.message}`, 'error-msg');
                        this.currentState = GameState.SYSTEM_OVERRIDE;
                        submitBtn.disabled = false;
                    }
                });
        };

        nextLevelBtn.onclick = () => {
            document.getElementById('compile-clash-terminal').classList.add('hidden');
            document.getElementById('compile-clash-terminal').classList.remove('terminal-anim-slide-in');
            this.scene.stop(this.activeGameplayScene);
            this.registry.set(REGISTRY_SUBLEVEL, parseInt(this.registry.get('nextSub')) || 1);
            this.registry.set(REGISTRY_MODULE, parseInt(this.registry.get('nextMod')) || 1);
            this.currentState = GameState.PLAYING;
            this.startActiveGameplayScene();
        };
        this.uiBinded = true;

        // Dev Skip Feature: 'O' for instant terminal
        this.input.keyboard.on('keydown-O', () => {
            this.triggerSubLevelComplete();
        });
    }
}

// ------ LOCAL CO-OP & RAGE LOGIC ------
class LevelDevilScene extends Phaser.Scene {
    constructor() { super('LevelDevilScene'); }

    init(data) {
        this.subLevel = data.subLevel || parseInt(this.registry.get(REGISTRY_SUBLEVEL)) || 1;
        this.mazePhase = 0; // 0: Start, 1: Wall Triggered, 2: Storm Triggered, 3: Completed
    }

    create() {
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor('#000033');

        this.hasMovedForward = false;
        this.decayX = 50;
        this.physics.world.gravity.y = 800;
        this.p1DeathFlag = false;

        // Sub-level 2 specific groups
        this.spikeWallGroup = this.physics.add.group();
        this.spikeStormGroup = this.physics.add.group();

        // Visual Setup
        const bgKeys = ['bg0', 'bg1', 'bg2', 'bg3', 'bg4', 'bg5', 'bg6'];
        const factors = [0, 0.1, 0.25, 0.4, 0.6, 0.8, 0.9];
        bgKeys.forEach((key, idx) => {
            let tex = this.textures.get(key).getSourceImage();
            let scaleRatio = height / tex.height;
            let bgWidth = (width / scaleRatio) + 4000; // Buffer for Descent (X=3000+)
            let bg = this.add.tileSprite(0, 0, bgWidth, tex.height, key)
                .setOrigin(0, 0).setScrollFactor(factors[idx]).setDepth(-10);
            bg.setScale(scaleRatio);
        });

        // HUD Setup
        this.controlsHUD = this.add.container(width / 2, height / 2 - 100).setScrollFactor(0).setDepth(100);
        this.controlsHUD.add(this.add.text(0, 0, "WASD / ARROWS", { fontSize: '40px', color: '#00FFFF', fontStyle: 'bold' }).setOrigin(0.5));
        this.input.keyboard.once('keydown', () => { this.tweens.add({ targets: this.controlsHUD, alpha: 0, duration: 1000 }); });

        // Physics Group Setup
        this.platforms = this.physics.add.staticGroup();
        this.trollGroup = this.physics.add.group(); // Dynamic for trolls

        // PLAYER SETUP (Must exist BEFORE generatePath colliders)
        let sx, sy;
        if (this.subLevel === 1) { sx = 100; sy = height - 120; }
        else if (this.subLevel === 2) { sx = width - 160; sy = height / 2 + 50; }
        else { sx = 50; sy = height / 2; }

        this.player1 = this.physics.add.sprite(sx, sy, 'p1').setScale(1.5);
        this.player1.setCollideWorldBounds(false).body.setSize(18, 28).setOffset(7, 4);
        this.p1Keys = this.input.keyboard.addKeys('W,A,S,D');

        if (globalPlayerCount === 2) {
            let p2sx;
            if (this.subLevel === 1) p2sx = 150;
            else if (this.subLevel === 2) p2sx = width - 180;
            else p2sx = 100;
            this.player2 = this.physics.add.sprite(p2sx, sy, 'p1').setScale(1.5).setTint(0x00ffff);
            this.player2.setCollideWorldBounds(false).body.setSize(18, 28).setOffset(7, 4);
            this.p2Keys = this.input.keyboard.createCursorKeys();
        }

        // Init Waves & Phases
        this.mazePhase = 0;
        this.wave1X = 150;
        this.wave2X = width - 50;
        this.chasingSpikesGroup = this.physics.add.group();

        this.chasingX = 0;
        this.chasingStarted = false;

        // COLLIDERS (Establish ONCE)
        this.physics.add.collider(this.player1, this.platforms);
        this.physics.add.collider(this.player1, this.trollGroup);
        if (globalPlayerCount === 2) {
            this.physics.add.collider(this.player2, this.platforms);
            this.physics.add.collider(this.player2, this.trollGroup);
        }

        // Death overlap for Sublevel 3 chasing spikes
        this.physics.overlap(this.player1, [this.chasingSpikesGroup], () => this.handleDeath());
        if (globalPlayerCount === 2 && this.player2) {
            this.physics.overlap(this.player2, [this.chasingSpikesGroup], () => this.handleDeath());
        }

        // Build Level
        this.generatePath();

        // Camera Logic
        this.physics.world.setBounds(0, -1000, 3000, height + 2000);
        this.cameras.main.setBounds(0, -500, 3000, height + 500);
        this.cameras.main.setLerp(0.1, 0.1).setZoom(1.0);

        this.input.keyboard.removeCapture('SPACE');
        this.input.keyboard.on('keydown-SPACE', () => { this.game.events.emit('trigger-terminal'); });
    }

    generatePath() {
        const { width, height } = this.scale;
        this.platforms.clear(true, true);
        this.trollGroup.clear(true, true);
        if (this.portal) this.portal.destroy();

        if (this.subLevel === 1) {
            let floorY = height - 32;
            for (let x = 50; x <= 2500; x += 64) {
                let rect = this.add.rectangle(x, floorY, 64, 32, 0x00ffff, 0.3);
                if (x >= 2200 && x < 2264) {
                    this.physics.add.existing(rect, false);
                    rect.body.setImmovable(true).setAllowGravity(false);
                    rect.body.moves = false;
                    this.trollGroup.add(rect);
                    this.trollBlock = rect;
                } else {
                    this.physics.add.existing(rect, true);
                    this.platforms.add(rect);
                    if (x >= 2400 && x < 2464) this.portalPlatform = rect;
                }
            }
            this.portal = this.physics.add.staticSprite(2400, height - 100, 'portal', 0).setScale(1.5).setTint(0x00ffff);
        } else if (this.subLevel === 2) {
            // SUB-LEVEL 2: 'NO-JUMP' CORRIDOR & NARROW PIT
            const centerY = height / 2;
            const floorY = centerY + 50;
            const ceilingY = floorY - 60;
            const pitX = width - 200;
            const pitW = 80;

            // 1. Teal Maze Walls (Main Boundaries)
            let topWall = this.add.rectangle(width / 2, ceilingY - 100, width, 200, 0x00ffff, 0.3);
            this.physics.add.existing(topWall, true); this.platforms.add(topWall);
            let floorWall = this.add.rectangle((150 + (width - 200)) / 2, floorY + 100, (width - 200) - 150, 200, 0x00ffff, 0.3);
            this.physics.add.existing(floorWall, true); this.platforms.add(floorWall);
            this.pitFloorY = floorY + 60;
            let pitFloor = this.add.rectangle(pitX + pitW / 2, this.pitFloorY + 25, pitW, 50, 0x00ffff, 0.3);
            this.physics.add.existing(pitFloor, true); this.platforms.add(pitFloor);
            let pitRight = this.add.rectangle(pitX + pitW + 10, centerY, 20, height, 0x00ffff, 0.3);
            this.physics.add.existing(pitRight, true); this.platforms.add(pitRight);
            let pitLeft = this.add.rectangle(pitX - 5, floorY + 30, 10, 60, 0x00ffff, 0.3);
            this.physics.add.existing(pitLeft, true); this.platforms.add(pitLeft);
            this.portal = this.physics.add.staticSprite(150, floorY - 30, 'portal', 0).setScale(1.5).setTint(0xffff00);// Invisible Physics Boundaries (The Yellow Path)
            // Ceiling (Strictly no jumping)
            let invCeil = this.add.rectangle((150 + (width - 120)) / 2, ceilingY, (width - 120) - 150, 10, 0x00ffff, 0);
            this.physics.add.existing(invCeil, true); this.platforms.add(invCeil);
            // Main Floor
            let invFloor = this.add.rectangle((150 + (width - 200)) / 2, floorY, (width - 200) - 150, 10, 0x00ffff, 0);
            this.physics.add.existing(invFloor, true); this.platforms.add(invFloor);

            this.portal = this.physics.add.staticSprite(150, floorY - 30, 'portal', 0).setScale(1.5);
            this.portal.anims.play('portal_swirl', true).setTint(0x00ffff);

            this.floorY = floorY; // Store for wave logic
        } else if (this.subLevel === 3) {
            // SUB-LEVEL 3: THE BROKEN BRIDGE
            const centerY = height / 2;
            const floorY = centerY + 50;
            this.floorY = floorY;

            // 1. Phase 1: Broken Bridge (Neon Cyan Rects)
            let mainFloor = this.add.rectangle(750, floorY + 100, 1500, 200, 0x00ffff, 0.3);
            this.physics.add.existing(mainFloor, true); this.platforms.add(mainFloor);
            let landingPad = this.add.rectangle(1800, floorY + 100, 200, 200, 0x00ffff, 0.3);
            this.physics.add.existing(landingPad, true); this.platforms.add(landingPad);

            // 3. Troll Spikes (Hidden in Landing Pad)
            this.trollSpikesGroup = this.physics.add.staticGroup();
            for (let x = 1710; x <= 1780; x += 25) {
                let spike = this.trollSpikesGroup.create(x, floorY + 15, 'spike-sprite').setScale(0.5);
                spike.setVisible(false); // Hide initially
                if (spike.body) spike.body.enable = false; // Disable hitbox initially
            }

            // Yellow Portal (SL 1-2 Phase 2)
            this.portal = this.physics.add.staticSprite(1850, floorY - 30, 'portal', 0).setScale(1.5).setTint(0xffff00);
            this.portal.anims.play('portal_swirl', true);

            // 5. Phase 2 Section (The Destination: 850px wide)
            this.phase2Spikes = this.physics.add.staticGroup();

            // Outer Walls
            let leftWall = this.add.rectangle(2980, 400, 20, 1000, 0x00ffff, 0.3);
            this.physics.add.existing(leftWall, true); this.platforms.add(leftWall);
            let rightWall = this.add.rectangle(3870, 400, 20, 1000, 0x00ffff, 0.3);
            this.physics.add.existing(rightWall, true); this.platforms.add(rightWall);

            // Zig-Zag Platforms (Extra tier + Tight 120px gaps)
            const pConfigs = [
                { x: 3325, y: 150, w: 650 }, // Tier 1: Gap Right
                { x: 3525, y: 270, w: 650 }, // Tier 2: Gap Left
                { x: 3325, y: 390, w: 650 }, // Tier 3: Gap Right
                { x: 3525, y: 510, w: 650 }, // Tier 4: Gap Left
                { x: 3425, y: 630, w: 850 }  // Bottom Floor (3000 to 3850)
            ];
            pConfigs.forEach(p => {
                let rect = this.add.rectangle(p.x, p.y + 10, p.w, 20, 0x00ffff, 0.3);
                this.physics.add.existing(rect, true); this.platforms.add(rect);
            });

            // Spike Bed at Bottom (3600 to 3850)
            for (let x = 3610; x <= 3850; x += 25) {
                let spike = this.phase2Spikes.create(x, 630 - 15, 'spike-sprite').setScale(0.25);
                spike.body.setSize(4, 4).setOffset(14, 14);
            }

            // RED PORTAL (Final Gate)
            this.redPortal = this.physics.add.staticSprite(3050, 580, 'portal', 0).setScale(1.5).setTint(0xff0000);
            this.redPortal.anims.play('portal_swirl', true);
            this.redPortalMovementStarted = false;
        }
    }

    update() {
        if (this.scene.get('UIScene').currentState !== GameState.PLAYING || this.p1DeathFlag) return;

        let p1XVel = 0; let p2XVel = 0;
        if (this.p1Keys.A.isDown) p1XVel = -200;
        else if (this.p1Keys.D.isDown) p1XVel = 200;

        if (globalPlayerCount === 2 && this.p2Keys) {
            if (this.p2Keys.left.isDown) p2XVel = -200;
            else if (this.p2Keys.right.isDown) p2XVel = 200;
        }

        if (!this.hasMovedForward && (p1XVel > 0 || p2XVel > 0)) this.hasMovedForward = true;

        this.player1.setVelocityX(p1XVel);
        if (!this.player1.isDying) this.player1.anims.play(p1XVel !== 0 ? 'p1_walk' : 'p1_idle', true);
        if (p1XVel !== 0) this.player1.setFlipX(p1XVel < 0);

        let p1TouchesDown = this.player1.body.touching.down || this.player1.body.blocked.down;
        if (p1TouchesDown) this.player1.lastGroundedTime = this.time.now;
        if (Phaser.Input.Keyboard.JustDown(this.p1Keys.W) && (p1TouchesDown || (this.time.now - this.player1.lastGroundedTime < 100))) {
            this.player1.setVelocityY(-450); this.player1.anims.play('p1_jump', true);
        }

        if (globalPlayerCount === 2 && this.player2 && this.player2.active) {
            this.player2.setVelocityX(p2XVel);
            if (!this.player2.isDying) this.player2.anims.play(p1XVel !== 0 ? 'p1_walk' : 'p1_idle', true);
            if (p2XVel !== 0) this.player2.setFlipX(p2XVel < 0);
            let p2TouchesDown = this.player2.body.touching.down || this.player2.body.blocked.down;
            if (p2TouchesDown) this.player2.lastGroundedTime = this.time.now;
            if (Phaser.Input.Keyboard.JustDown(this.p2Keys.up) && (p2TouchesDown || (this.time.now - this.player2.lastGroundedTime < 100))) {
                this.player2.setVelocityY(-450); this.player2.anims.play('p1_jump', true);
            }
        }

        // Section 4: Triggered Simple Decay
        if (this.subLevel === 1) {
            if (this.hasMovedForward) {
                this.decayX += 0.8;
                this.platforms.getChildren().forEach(p => {
                    if (p.x < this.decayX && p !== this.portalPlatform) p.destroy();
                });
            }
            if (this.trollBlock && this.trollBlock.active && !this.trollBlock.isTriggered) {
                if (this.player1.x > 1800 || (this.player2 && this.player2.x > 1800)) {
                    let p1Dist = Math.abs(this.player1.x - this.trollBlock.x);
                    let p2Dist = (globalPlayerCount === 2 && this.player2) ? Math.abs(this.player2.x - this.trollBlock.x) : 999;
                    if (p1Dist < 80 || p2Dist < 80) {
                        this.trollBlock.isTriggered = true;
                        this.trollBlock.body.moves = true;
                        this.trollBlock.body.setImmovable(false).setAllowGravity(true).setVelocityY(600);
                    }
                }
            }
            
            let targetX = (globalPlayerCount === 2 && this.player2 && this.player2.active) ? (this.player1.x + this.player2.x) / 2 : this.player1.x;
            this.cameras.main.scrollX += (targetX - (this.cameras.main.width / 2) - this.cameras.main.scrollX) * 0.1;
            this.cameras.main.scrollY = 0;
        }

        // Sub-level 2 Logic: Maze & Rage
        if (this.subLevel === 2) {
            this.cameras.main.scrollX = 0; this.cameras.main.scrollY = 0;
            const { width, height } = this.scale;
            const pathMidpoint = ((width - 200) + 150) / 2;

            if (this.mazePhase === 0 && (this.player1.x < pathMidpoint || (this.player2 && this.player2.x < pathMidpoint))) {
                this.mazePhase = 0.5;
                this.wave1Event = this.time.addEvent({
                    delay: 100,
                    callback: () => {
                        if (this.p1DeathFlag) return;
                        if (this.wave1X > width + 50) { if (this.wave1Event) this.wave1Event.remove(); this.mazePhase = 1; return; }
                        this.spawnWaveSpike(this.wave1X, this.floorY);
                        this.wave1X += 25;
                    },
                    loop: true
                });
            }

            if (this.mazePhase === 1 && (this.player1.x < pathMidpoint + 80 || (this.player2 && this.player2.x < pathMidpoint + 80))) {
                this.mazePhase = 2;
                this.wave2Event = this.time.addEvent({
                    delay: 100,
                    callback: () => {
                        if (this.p1DeathFlag) return;
                        if (this.wave2X < 0) { if (this.wave2Event) this.wave2Event.remove(); return; }
                        let targetY = (this.wave2X > width - 200 && this.wave2X < width - 120) ? this.pitFloorY : this.floorY;
                        this.spawnWaveSpike(this.wave2X, targetY);
                        this.wave2X -= 30;
                    },
                    loop: true
                });
            }

            this.physics.overlap(this.player1, this.spikeStormGroup, () => this.handleDeath());
            if (globalPlayerCount === 2 && this.player2) {
                this.physics.overlap(this.player2, this.spikeStormGroup, () => this.handleDeath());
            }
        }

        // Sub-level 3 Logic: Multi-Phase Challenge
        if (this.subLevel === 3) {
            // A. Shared Portal Teleport (Yellow -> Phase 2)
            if (this.portal && !this.inPhase2) {
                if (this.physics.overlap(this.player1, this.portal) || (this.player2 && this.physics.overlap(this.player2, this.portal))) {
                    if (!this.teleported) { this.teleported = true; this.teleportToPhase2(); }
                }
            }

            // B. Shared Terminal (Red Portal -> Terminal)
            if (this.inPhase2 && this.redPortal) {
                let p1In = this.physics.overlap(this.player1, this.redPortal);
                let p2In = (globalPlayerCount === 2 && this.player2) ? this.physics.overlap(this.player2, this.redPortal) : true;
                if (p1In && p2In) this.game.events.emit('trigger-terminal');
            }

            const { width, height } = this.scale;
            const floorY = height / 2 + 50;

            // C. Hazards
            if (!this.inPhase2 && !this.chasingStarted && this.player1.x > 150) {
                this.chasingStarted = true;
                this.chasingEvent = this.time.addEvent({
                    delay: 150,
                    callback: () => {
                        if (this.p1DeathFlag) return;
                        if (this.chasingX >= 1350) { if (this.chasingEvent) this.chasingEvent.remove(); return; }
                        this.spawnWaveSpike(this.chasingX, floorY, true, true);
                        this.chasingX += 20;
                    },
                    loop: true
                });
            }

            if (!this.trollSpikesTriggered) {
                let p1Mid = this.player1.x > 1550 && this.player1.x < 1650;
                let p2Mid = (this.player2) ? (this.player2.x > 1550 && this.player2.x < 1650) : false;
                if (p1Mid || p2Mid) {
                    this.trollSpikesTriggered = true;
                    this.trollSpikesGroup.getChildren().forEach(s => {
                        s.setVisible(true); if (s.body) s.body.enable = true;
                        this.tweens.add({ targets: s, y: floorY - 15, duration: 100, ease: 'Power2' });
                    });
                    // Retract after 2s
                    this.time.delayedCall(2000, () => {
                        this.trollSpikesGroup.getChildren().forEach(s => {
                            this.tweens.add({ targets: s, y: floorY + 15, duration: 500, onComplete: () => {
                                s.setVisible(false); if (s.body) s.body.enable = false;
                            }});
                        });
                    });
                }
            }

            this.physics.overlap(this.player1, [this.chasingSpikesGroup, this.trollSpikesGroup], () => this.handleDeath());
            if (this.player2) this.physics.overlap(this.player2, [this.chasingSpikesGroup, this.trollSpikesGroup], () => this.handleDeath());

            if (this.inPhase2) {
                let avgY = (this.player2) ? (this.player1.y + this.player2.y) / 2 : this.player1.y;
                this.cameras.main.scrollY += (avgY - 200 - this.cameras.main.scrollY) * 0.1;
                
                this.physics.overlap(this.player1, this.phase2Spikes, () => this.handleDeath());
                if (this.player2) this.physics.overlap(this.player2, this.phase2Spikes, () => this.handleDeath());
            } else {
                this.cameras.main.scrollY = 0;
            }

            let targetX = (this.player2) ? (this.player1.x + this.player2.x) / 2 : this.player1.x;
            this.cameras.main.scrollX += (targetX - width / 2 - this.cameras.main.scrollX) * 0.1;
        }

        if (this.player1.y > this.scale.height || (this.player2 && this.player2.y > this.scale.height)) {
            this.handleDeath();
        }

        if (this.portal && this.subLevel < 3) {
            let p1Overlap = this.physics.overlap(this.player1, this.portal);
            let p2Overlap = (this.player2) ? this.physics.overlap(this.player2, this.portal) : false;
            if (globalPlayerCount === 2 ? (p1Overlap && p2Overlap) : p1Overlap) this.game.events.emit('trigger-terminal');
        }
    }

    handleFallingPlatform(player, platform) {
        if (!platform.falling) {
            platform.falling = true;
            this.tweens.add({ targets: platform, alpha: 0, duration: 400, onComplete: () => platform.destroy() });
            this.time.delayedCall(200, () => { if (platform.body) platform.disableBody(true, false); });
        }
    }

    handleDeath() {
        if (this.p1DeathFlag) return;
        this.p1DeathFlag = true;

        this.player1.setVelocity(0, 0).setTint(0xff0000);
        if (globalPlayerCount === 2 && this.player2) this.player2.setVelocity(0, 0).setTint(0xff0000);

        this.time.delayedCall(500, () => {
            this.hasMovedForward = false;
            this.decayX = 50;
            this.mazePhase = 0;
            this.wave1X = 150;
            const { width, height } = this.scale;
            this.wave2X = width - 50;

            if (this.wave1Event) this.wave1Event.remove();
            if (this.wave2Event) this.wave2Event.remove();

            this.spikeWallGroup.clear(true, true);
            this.spikeStormGroup.clear(true, true);
            this.chasingSpikesGroup.clear(true, true);
            this.trollSpikesTriggered = false;
            this.teleported = false;
            
            // Only reset these if NOT in Phase 2
            if (!this.inPhase2) {
                this.redPortalMovementStarted = false;
            }
            
            if (this.redPortal) {
                this.redPortal.x = 3050;
                this.redPortal.setX(3050);
            }
            this.chasingX = 0;
            this.chasingStarted = false;
            if (this.chasingEvent) this.chasingEvent.remove();
            this.generatePath();

            let sx, sy;
            const centerY = height / 2;
            if (this.inPhase2) {
                sx = 3050; sy = 100;
            } else if (this.subLevel === 1) {
                sx = 100; sy = height - 120;
            } else if (this.subLevel === 2) {
                sx = width - 160; sy = height / 2 + 50;
            } else {
                sx = 50; sy = centerY;
            }

            this.player1.setPosition(sx, sy).setVelocity(0, 0).clearTint();
            if (globalPlayerCount === 2 && this.player2) {
                let p2sx = sx + 40;
                this.player2.setPosition(p2sx, sy).setVelocity(0, 0).setTint(0x00ffff);
            }

            if (this.subLevel === 2) {
                // Wave 1 will re-trigger in update() based on distance
                if (this.wave1Event) this.wave1Event.remove();
                if (this.wave2Event) this.wave2Event.remove();
            }
            this.p1DeathFlag = false;
        });
    }

    spawnWaveSpike(x, y, isChasing = false, persist = false) {
        let group = isChasing ? this.chasingSpikesGroup : this.spikeStormGroup;
        let spike = group.create(x, y + 5, 'spike-sprite').setScale(0.25);
        spike.body.setAllowGravity(false).setSize(6, 6).setOffset(13, 13); // Precision hitbox
        if (persist) spike.persist = true;
        this.tweens.add({ targets: spike, y: y - 25, duration: 100, ease: 'Power2' });

        this.time.delayedCall(500, () => {
            if (spike.active && !spike.persist) spike.destroy();
        });
    }

    teleportToPhase2() {
        this.inPhase2 = true;
        const tx = 3050, ty = 100; 
        this.player1.setPosition(tx, ty).setVelocity(0,0);
        if (this.player2) this.player2.setPosition(tx + 40, ty).setVelocity(0,0);
        
        this.physics.world.setBounds(0, 0, 5000, 1500);
        this.cameras.main.setBounds(0, -200, 5000, 1500);
        this.cameras.main.scrollX = tx - (this.scale.width / 2);
        this.cameras.main.scrollY = 0;
        this.cameras.main.flash(500, 255, 255, 0);
    }

    triggerSpikes(player, pad) {
        this.spikeTriggers.getChildren().forEach(s => {
            if (s.parentPad === pad && !s.visible) {
                s.setVisible(true);
                s.body.enable = true;
                const targetY = s.isCeiling ? s.y + 30 : s.y - 30;
                this.tweens.add({ targets: s, y: targetY, duration: 100, ease: 'Power2' });
            }
        });
    }
}

// ------ MODULE 2 & END ------
class DataFragmentScene extends Phaser.Scene {
    constructor() { super('DataFragmentScene'); }

    create() {
        const { width, height } = this.scale;
        this.subLevel = parseInt(this.registry.get(REGISTRY_SUBLEVEL)) || 1;
        
        // Dynamic Config
        if (this.subLevel === 1) {
            this.cols = 4; this.rows = 4;
            this.pieceW = 130; this.pieceH = 82;
            this.imgKey = 'puzzle_1'; this.refKey = 'puzzle_ref_1';
        } else {
            this.cols = 8; this.rows = 8;
            this.pieceW = 100; this.pieceH = 74;
            this.imgKey = 'puzzle_2'; this.refKey = 'puzzle_ref_2';
        }

        this.add.text(width / 2, 50, `[ MODULE 2 : DATA FRAGMENT S0${this.subLevel} ]`, { fontSize: '32px', fill: '#00ffff', fontStyle: 'bold', fontFamily: 'Courier New' }).setOrigin(0.5);
        
        // 1. Reference Image (Top Left)
        this.add.image(150, 150, this.refKey).setScale(0.3).setAlpha(0.5);

        // 2. Automated Target Grid Generation
        let startX = 450; let startY = 150;
        this.targets = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                let tx = startX + (c * this.pieceW) + (this.pieceW / 2);
                let ty = startY + (r * this.pieceH) + (this.pieceH / 2);
                this.targets.push({ x: tx, y: ty });
                this.add.rectangle(tx, ty, this.pieceW, this.pieceH).setStrokeStyle(1, 0x00ffff, 0.3);
            }
        }

        // 3. Spawning Pieces (Scattered Left)
        this.piecesPlaced = 0;
        let totalPieces = this.cols * this.rows;
        for (let i = 0; i < totalPieces; i++) {
            let rx = Phaser.Math.Between(100, 350);
            let ry = Phaser.Math.Between(150, 650);
            let piece = this.add.sprite(rx, ry, this.imgKey, i).setInteractive({ draggable: true });
            piece.on('pointerdown', () => { this.children.bringToTop(piece); });
        }

        // 4. Universal Drag & Snap Logic
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            let target = this.targets[gameObject.frame.name];
            let dist = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, target.x, target.y);

            if (dist < 50) {
                gameObject.setPosition(target.x, target.y);
                gameObject.disableInteractive();
                this.piecesPlaced++;
                
                if (this.piecesPlaced === totalPieces) {
                    this.add.text(width / 2, height / 2, '> DATA RESTORED <', { fontSize: '48px', fill: '#39ff14', fontStyle: 'bold', fontFamily: 'Courier New' }).setOrigin(0.5);
                    this.time.delayedCall(1500, () => {
                        this.game.events.emit('trigger-terminal');
                    });
                }
            }
        });
    }
}

// ------ MODULE 3: DRIFT RACING ------
class DriftRacingScene extends Phaser.Scene {
    constructor() { super('DriftRacingScene'); }

    create() {
        const { width, height } = this.scale;
        this.subLevel = parseInt(this.registry.get(REGISTRY_SUBLEVEL)) || 1;
        this.cameras.main.setBackgroundColor('#111111');
        this.physics.world.gravity.y = 0;

        // 1. Dynamic Track Architecture (Fits full screen)
        this.add.rectangle(width / 2, height / 2, width, height, 0x222222);
        
        this.walls = this.physics.add.staticGroup();
        // Outer Boundaries (Explicit body alignment)
        this.walls = this.physics.add.staticGroup();
        // Outer Boundaries (Top-Left origin for perfect body alignment)
        const wallThickness = 40;
        const hitboxShift = 40; // Total shift requested for rightward alignment

        // Top Wall
        this.walls.add(this.add.rectangle(0, -wallThickness, width + 100, wallThickness, 0x00ffff, 0).setOrigin(0));
        // Bottom Wall
        this.walls.add(this.add.rectangle(0, height, width + 100, wallThickness, 0x00ffff, 0).setOrigin(0));
        // Left Wall
        this.walls.add(this.add.rectangle(-wallThickness, 0, wallThickness, height, 0x00ffff, 0).setOrigin(0));
        // Right Wall
        this.walls.add(this.add.rectangle(width + hitboxShift, 0, wallThickness, height, 0x00ffff, 0).setOrigin(0));
        
        // Inner Island (Manual hitbox centering + Shift)
        let islandW = width * 0.7;
        let islandH = height * 0.5;
        let islandX = (width - islandW) / 2 + hitboxShift;
        let islandY = (height - islandH) / 2;
        
        let islandVisual = this.add.rectangle(islandX, islandY, islandW, islandH, 0x111111).setOrigin(0);
        this.physics.add.existing(islandVisual, true);
        this.walls.add(islandVisual);
        islandVisual.body.updateFromGameObject();

        // 2. Lap System & Spawning Math
        let botLaneY = height - (height - islandH) / 4;
        let topLaneY = (height - islandH) / 4;

        // Hazard Spawning
        this.obstacles = this.physics.add.staticGroup();
        if (this.subLevel >= 2) {
            const islandL = width/2 - islandW/2, islandR = width/2 + islandW/2;
            const islandT = height/2 - islandH/2, islandB = height/2 + islandH/2;
            const spawnedCoords = [];

            for (let i = 0; i < 20; i++) {
                let rx, ry, isValid = false, attempts = 0;
                while (!isValid && attempts < 100) {
                    attempts++;
                    rx = Phaser.Math.Between(50, width - 50);
                    ry = Phaser.Math.Between(50, height - 50);
                    
                    let inIsland = (rx > islandL - 20 && rx < islandR + 20 && ry > islandT - 20 && ry < islandB + 20);
                    let nearStart = Phaser.Math.Distance.Between(rx, ry, width / 2, botLaneY) < 250;
                    let tooClose = spawnedCoords.some(c => Phaser.Math.Distance.Between(rx, ry, c.x, c.y) < 100);

                    if (!inIsland && !nearStart && !tooClose) isValid = true;
                }

                if (isValid) {
                    spawnedCoords.push({x: rx, y: ry});
                    let key = Math.random() > 0.5 ? 'tyres' : 'cone';
                    let scale = (key === 'tyres') ? 0.04 : 0.05;
                    let obs = this.obstacles.create(rx, ry, key).setScale(scale);
                    obs.refreshBody(); // Sync the static physics body to new scale
                    obs.body.setSize(obs.width * scale * 0.8, obs.height * scale * 0.8);
                    obs.body.setOffset(obs.width * scale * 0.1, obs.height * scale * 0.1);
                }
            }
        }
        
        this.lapLine = this.add.rectangle(width / 2, botLaneY, 20, (height - islandH) / 2, 0x39ff14, 0.5);
        this.physics.add.existing(this.lapLine, true);
        
        this.checkpoint = this.add.rectangle(width / 2, topLaneY, 20, (height - islandH) / 2, 0x000000, 0);
        this.physics.add.existing(this.checkpoint, true);

        // 3. Cars
        this.p1 = this.createCar(width / 2, botLaneY - 15, 0x39ff14, this.input.keyboard.addKeys('W,A,S,D'));
        this.p2 = this.createCar(width / 2, botLaneY + 15, 0x00ffff, this.input.keyboard.createCursorKeys());
        
        this.physics.add.collider([this.p1, this.p2], this.walls);
        this.physics.add.collider([this.p1, this.p2], this.obstacles);
        this.physics.add.collider(this.p1, this.p2);

        // Lap Overlaps
        this.p1.laps = 0; this.p2.laps = 0;
        this.physics.add.overlap(this.p1, this.lapLine, () => this.handleLap(this.p1));
        this.physics.add.overlap(this.p2, this.lapLine, () => this.handleLap(this.p2));
        this.physics.add.overlap([this.p1, this.p2], this.checkpoint, (car) => { car.passedCheckpoint = true; });

        // Darkness Overlay for Sub-level 3
        if (this.subLevel === 3) {
            // Giant pitch-black rectangle covering the world
            this.darkOverlay = this.add.rectangle(0, 0, 5000, 5000, 0x000000, 0.98).setOrigin(0).setDepth(90); 

            // Graphics object that will act as the "cookie cutter"
            this.visionMask = this.add.graphics();
            this.visionMask.setVisible(false); // THIS IS THE FIX

            let mask = new Phaser.Display.Masks.GeometryMask(this, this.visionMask);
            mask.setInvertAlpha(true); // Makes drawn shapes transparent instead of solid
            this.darkOverlay.setMask(mask);
        }

        // HUD
        this.lapText = this.add.text(20, 80, 'P1 Laps: 0/5 | P2 Laps: 0/5', { fontSize: '24px', fill: '#39ff14', fontFamily: 'Courier New' }).setScrollFactor(0).setDepth(1000);
        
        // Camera Setup
        this.cameras.main.centerOn(width / 2, height / 2);
        this.cameras.main.setZoom(1.0);
        this.cameras.main.setBounds(0, 0, width, height);
    }

    createCar(x, y, color, keys) {
        let container = this.add.container(x, y);
        let spriteScale = 0.2;
        let sprite = this.add.sprite(0, 0, 'car').setTint(color).setRotation(Math.PI).setScale(spriteScale);
        container.add(sprite);
        
        // Headlight indicator (corrected direction and scale)
        let light = this.add.triangle(-8, 0, 0, -2, 0, 2, -12, 0, 0xffffff, 0.8);
        container.add(light);

        this.physics.add.existing(container);
        container.body.setMaxVelocity(350);
        container.body.setDamping(true);
        container.body.setDrag(0.96);
        container.body.setBounce(0.6);
        container.body.setSize(sprite.width * spriteScale, sprite.height * spriteScale);

        container.ctrls = keys;
        container.passedCheckpoint = false;
        return container;
    }

    update() {
        if (!this.p1 || !this.p1.ctrls) return;
        this.driveCar(this.p1, this.p1.ctrls.W, this.p1.ctrls.S, this.p1.ctrls.A, this.p1.ctrls.D);
        this.driveCar(this.p2, this.p2.ctrls.up, this.p2.ctrls.down, this.p2.ctrls.left, this.p2.ctrls.right);

        // Dynamic Headlight Math for Sub-level 3
        if (this.subLevel === 3 && this.visionMask) {
            this.visionMask.clear();
            this.visionMask.fillStyle(0xffffff, 1);

            let drawHeadlight = (car) => {
                let angle = car.rotation; 
                let spread = 0.5; // Beam width (radians)
                let length = 400; // Beam distance

                // Draw the main headlight cone
                this.visionMask.beginPath();
                this.visionMask.moveTo(car.x, car.y);
                this.visionMask.lineTo(car.x + Math.cos(angle - spread) * length, car.y + Math.sin(angle - spread) * length);
                this.visionMask.lineTo(car.x + Math.cos(angle + spread) * length, car.y + Math.sin(angle + spread) * length);
                this.visionMask.closePath();
                this.visionMask.fillPath();

                // Draw a small ambient glow circle around the car so players can see themselves
                this.visionMask.fillCircle(car.x, car.y, 70); 
            };

            if (this.p1 && this.p1.active) drawHeadlight(this.p1);
            if (this.p2 && this.p2.active) drawHeadlight(this.p2);
        }
    }

    driveCar(car, up, down, left, right) {
        if (left.isDown) car.body.setAngularVelocity(-200);
        else if (right.isDown) car.body.setAngularVelocity(200);
        else car.body.setAngularVelocity(0);

        if (up.isDown) {
            this.physics.velocityFromRotation(car.rotation, 300, car.body.acceleration);
        } else if (down.isDown) {
            this.physics.velocityFromRotation(car.rotation, -150, car.body.acceleration);
        } else {
            car.body.setAcceleration(0);
        }
    }

    handleLap(car) {
        if (car.passedCheckpoint) {
            car.laps++;
            car.passedCheckpoint = false;
            this.lapText.setText(`P1 Laps: ${this.p1.laps}/5 | P2 Laps: ${this.p2.laps}/5`);
            if (this.p1.laps >= 5 && this.p2.laps >= 5) {
                this.add.text(1000, 600, '> RACE COMPLETE <', { fontSize: '64px', fill: '#39ff14', fontStyle: 'bold' }).setOrigin(0.5).setScrollFactor(0);
                this.time.delayedCall(1500, () => this.game.events.emit('trigger-terminal'));
            }
        }
    }
}

// ------ MODULE 4: SPACE SHOOTER ------
class SpaceShooterScene extends Phaser.Scene {
    constructor() { super('SpaceShooterScene'); }

    create() {
        const { width, height } = this.scale;
        this.subLevel = parseInt(this.registry.get(REGISTRY_SUBLEVEL)) || 1;
        this.physics.world.gravity.y = 0;

        // 1. Vertical Background
        this.bg = this.add.tileSprite(0, 0, width, height, 'shooter_bg').setOrigin(0, 0);

        // 2. Animation Setup
        if (!this.anims.exists('vfx_exhaust')) {
            this.anims.create({
                key: 'vfx_exhaust',
                frames: [
                    { key: 'exhaust_01' }, { key: 'exhaust_02' }, { key: 'exhaust_03' }, { key: 'exhaust_04' }, { key: 'exhaust_05' }
                ],
                frameRate: 15, repeat: -1
            });
            this.anims.create({
                key: 'vfx_explosion',
                frames: Array.from({length:11}, (_, i) => ({ key: `explosion_1_${(i+1)<10?'0'+(i+1):(i+1)}` })),
                frameRate: 20, repeat: 0
            });
            this.anims.create({
                key: 'boom_2',
                frames: Array.from({length:9}, (_, i) => ({ key: `explosion_2_0${i+1}` })),
                frameRate: 20, repeat: 0
            });
            this.anims.create({
                key: 'mine_spin',
                frames: Array.from({length:9}, (_, i) => ({ key: `mine_${i+1}` })),
                frameRate: 15, repeat: -1
            });
            this.anims.create({
                key: 'boom_3',
                frames: Array.from({length:9}, (_, i) => ({ key: `explosion_3_0${i+1}` })),
                frameRate: 20, repeat: 0
            });
        }

        // 3. Groups & Stats
        this.playersArr = [];
        this.p1HP = 3; 
        this.p2HP = (globalPlayerCount === 2) ? 3 : 0;
        
        this.bullets = this.physics.add.group();
        this.enemyBullets = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.shooterEnemies = this.physics.add.group();
        this.asteroids = this.physics.add.group();
        this.mines = this.physics.add.group();
        this.bossBullets = this.physics.add.group();

        this.p1 = this.createPlayer(width / 2 - 50, height - 100, 'p1_m', this.input.keyboard.addKeys('W,A,S,D'), 'plasma_1', 'SPACE');
        this.p2 = this.createCarLikePlayer(width / 2 + 50, height - 100, 'p2_m', this.input.keyboard.createCursorKeys(), 'plasma_2', 'ENTER');
        if (globalPlayerCount < 2) { this.p2.setActive(false).setVisible(false); }
        this.playersArr.push(this.p1, this.p2);

        // 4. Boss Initialization
        if (this.subLevel === 3) {
            this.boss = this.physics.add.sprite(width / 2, 120, 'boss').setScale(1.2).setImmovable(true);
            this.boss.setDepth(40); 
            // Shrink hitbox to the center core region
            this.boss.body.setSize(this.boss.width * 0.4, this.boss.height * 0.6);
            this.boss.body.setOffset(this.boss.width * 0.3, this.boss.height * 0.2);
            this.boss.hp = 100; this.boss.maxHp = 100;
            this.bossDead = false;
        }

        // 5. Hazards Timers
        let asteroidDelay = 1500;
        this.spawnTimerAsteroid = this.time.addEvent({ delay: asteroidDelay, callback: this.spawnAsteroid, callbackScope: this, loop: true });
        this.spawnTimerEnemy = this.time.addEvent({ delay: 2000, callback: this.spawnEnemy, callbackScope: this, loop: true });
        
        if (this.subLevel === 2) {
            this.spawnTimerShooter = this.time.addEvent({ delay: 3000, callback: this.spawnShooter, callbackScope: this, loop: true });
        }
        if (this.subLevel === 3) {
            this.time.addEvent({ delay: 4000, callback: this.spawnMine, callbackScope: this, loop: true });
            this.bossAttackTimer = this.time.addEvent({ delay: 1500, callback: this.bossAttack, callbackScope: this, loop: true });
        }

        // 6. Physics Colliders
        this.physics.add.collider(this.bullets, this.enemies, this.hitEnemy, null, this);
        this.physics.add.collider(this.bullets, this.shooterEnemies, this.hitShooter, null, this);
        this.physics.add.collider(this.bullets, this.mines, this.detonateMine, null, this);
        
        // Asteroid Tennis (Deflection)
        this.physics.add.overlap(this.bullets, this.asteroids, (bullet, asteroid) => {
            bullet.destroy();
            asteroid.setVelocityY(-400);
            asteroid.isDeflected = true;
            asteroid.setTint(0xff0000);
        }, null, this);

        // Planetoid Shield (Blocking Boss fire)
        this.physics.add.overlap([this.enemyBullets, this.bossBullets], this.asteroids, (eb, ast) => { eb.destroy(); }, null, this);

        // Damage Boss
        if (this.boss) {
            this.physics.add.overlap(this.asteroids, this.boss, (boss, asteroid) => {
                if (asteroid.isDeflected) {
                    this.damageBoss(10);
                    let exp = this.add.sprite(asteroid.x, asteroid.y, 'explosion_2_01').setScale(1.2);
                    exp.play('boom_2');
                    exp.on('animationcomplete', () => exp.destroy());
                    asteroid.destroy(); // Only destroy if it hit the boss as a projectile
                }
            }, null, this);
        }

        this.physics.add.overlap([this.enemyBullets, this.bossBullets, this.enemies, this.shooterEnemies, this.asteroids, this.mines], this.playersArr, (p, h) => {
            if (h.texture && h.texture.key === 'asteroid' && h.isDeflected) return; // Don't die to own projectiles
            this.handleDeath(p, h);
        }, null, this);

        // 7. HUD
        this.enemiesDestroyed = 0;
        this.shootersDestroyed = 0;
        this.crashingSpawned = 0;
        this.shootersSpawned = 0;

        let hudText = this.subLevel === 1 ? 'DATA CORRUPTED: 0 / 20' : 
                      this.subLevel === 2 ? 'SYSTEM BREACH: 0/30 | 0/15' : 
                      'MOTHER-SHIP CORE: 100%';
        this.scoreText = this.add.text(20, 80, hudText, { fontSize: '24px', fill: '#00f3ff', fontFamily: 'Courier New' }).setScrollFactor(0);
        this.hpText = this.add.text(20, 110, `P1: [|||] ${this.p2.active ? ' | P2: [|||]' : ''}`, { fontSize: '18px', fill: '#ff3939', fontFamily: 'Courier New' }).setScrollFactor(0);
    }

    createPlayer(x, y, key, keys, bulletKey, shootKeyName) {
        let ship = this.physics.add.sprite(x, y, key).setScale(0.8);
        ship.setCollideWorldBounds(true);
        ship.ctrls = keys;
        ship.bulletKey = bulletKey;
        ship.shootKey = this.input.keyboard.addKey(shootKeyName);
        ship.baseKey = key.slice(0, 3); // 'p1_' or 'p2_'

        // Exhaust
        let ex = this.add.sprite(0, 20, 'exhaust_01').setScale(0.5);
        ex.play('vfx_exhaust');
        // We handle relative positioning manually in update as child sprites don't follow physics well in v3
        ship.exhaust = ex;
        return ship;
    }

    createCarLikePlayer(x, y, key, keys, bulletKey, shootKeyName) {
        // P2 uses arrows, we can't easily addKey('ENTER') while createCursorKeys is active in a generic way, but it works
        return this.createPlayer(x, y, key, keys, bulletKey, shootKeyName);
    }

    spawnAsteroid() {
        let x = Phaser.Math.Between(50, this.scale.width - 50);
        let scale = this.subLevel === 3 ? Phaser.Math.FloatBetween(0.4, 0.8) : (0.15 + Math.random() * 0.2);
        let ast = this.asteroids.create(x, -100, 'asteroid').setScale(scale);
        ast.setDepth(50); // In front of boss
        ast.setAngularVelocity(Phaser.Math.Between(-100, 100));
        ast.setVelocityY(Phaser.Math.Between(150, 300));
        ast.isDeflected = false;
    }

    spawnMine() {
        if (this.bossDead || this.boss.hp > 75) return;
        let x = Phaser.Math.Between(100, this.scale.width - 100);
        let mine = this.mines.create(x, -50, 'mine_1').setScale(0.8);
        mine.play('mine_spin');
        mine.setVelocityY(100);
    }

    bossAttack() {
        if (this.bossDead || this.boss.hp > 50) return;
        
        if (this.boss.hp > 25) {
            // Triangle Barrage
            let angles = [-0.4, -0.2, 0, 0.2, 0.4];
            angles.forEach((a, i) => {
                let key = i === 2 ? 'proton_01' : (i === 1 || i === 3 ? 'proton_02' : 'proton_03');
                let b = this.bossBullets.create(this.boss.x, this.boss.y + 100, key);
                this.physics.velocityFromRotation(Math.PI/2 + a, 400, b.body.velocity);
            });
        } else {
            // Wall of Death
            for(let x=0; x<this.scale.width; x+=60) {
                let b = this.bossBullets.create(x, this.boss.y + 100, 'proton_01');
                b.setVelocityY(350);
            }
        }
    }

    spawnEnemy() {
        if (this.subLevel === 3 && this.boss.hp <= 50) return; // Stop ships in final phases
        if (this.subLevel === 1 || (this.subLevel === 2 && this.crashingSpawned < 30) || (this.subLevel === 3 && this.boss.hp > 50)) {
            let x = Phaser.Math.Between(50, this.scale.width - 50);
            let variant = Math.random() > 0.5 ? 'o' : 'g';
            let en = this.enemies.create(x, -50, `enemy_${variant}_m`).setScale(0.6);
            en.baseKey = `enemy_${variant}`;
            en.lastShot = 0;
            this.crashingSpawned++;
        }
    }

    spawnShooter() {
        if (this.subLevel === 3 && this.boss.hp <= 50) return;
        if ((this.subLevel === 2 && this.shootersSpawned < 15) || (this.subLevel === 3 && this.boss.hp > 50)) {
            let x = Phaser.Math.Between(100, this.scale.width - 100);
            let color = ['r', 'g', 'b'][Math.floor(Math.random() * 3)];
            let en = this.shooterEnemies.create(x, -50, `enemy2_${color}_m`).setScale(0.6);
            en.color = color;
            en.shootTimer = 2000;
            this.shootersSpawned++;

            // Entry Tween
            this.tweens.add({
                targets: en,
                y: 150,
                duration: 1000,
                onComplete: () => {
                    // Ping-pong horizontal movement
                    let destX = en.x < this.scale.width / 2 ? this.scale.width - 100 : 100;
                    this.tweens.add({
                        targets: en,
                        x: destX,
                        duration: 3000,
                        yoyo: true,
                        repeat: -1
                    });
                }
            });
        }
    }

    update() {
        this.bg.tilePositionY -= 2;

        this.playersArr.forEach(p => {
            if (!p.active) return;
            p.setVelocity(0);
            
            // Movement
            if ((p.ctrls.A && p.ctrls.A.isDown) || (p.ctrls.left && p.ctrls.left.isDown)) {
                p.setVelocityX(-350);
                p.setTexture(p.baseKey + 'l');
            } else if ((p.ctrls.D && p.ctrls.D.isDown) || (p.ctrls.right && p.ctrls.right.isDown)) {
                p.setVelocityX(350);
                p.setTexture(p.baseKey + 'r');
            } else {
                p.setTexture(p.baseKey + 'm');
            }

            if ((p.ctrls.W && p.ctrls.W.isDown) || (p.ctrls.up && p.ctrls.up.isDown)) p.setVelocityY(-350);
            if ((p.ctrls.S && p.ctrls.S.isDown) || (p.ctrls.down && p.ctrls.down.isDown)) p.setVelocityY(350);

            // Exhaust sync
            p.exhaust.x = p.x;
            p.exhaust.y = p.y + 25;

            // Attack
            if (Phaser.Input.Keyboard.JustDown(p.shootKey)) {
                this.shoot(p);
            }
        });

        // Homing Logic & Banking
        this.enemies.getChildren().forEach(en => {
            let target = this.physics.closest(en, this.playersArr.filter(p => p.active));
            if (target) {
                this.physics.moveToObject(en, target, 200);
            }

            // Banking logic for enemies
            if (en.body.velocity.x < -50) en.setTexture(en.baseKey + '_l');
            else if (en.body.velocity.x > 50) en.setTexture(en.baseKey + '_r');
            else en.setTexture(en.baseKey + '_m');
        });

        // Shooter AI & Banking
        this.shooterEnemies.getChildren().forEach(en => {
            let dx = en.x - (en.lastX || en.x);
            if (dx < -1) en.setTexture(`enemy2_${en.color}_l`);
            else if (dx > 1) en.setTexture(`enemy2_${en.color}_r`);
            else en.setTexture(`enemy2_${en.color}_m`);
            en.lastX = en.x;

            // Firing
            if (!en.lastFired) en.lastFired = Date.now();
            if (Date.now() - en.lastFired > en.shootTimer) {
                let b = this.enemyBullets.create(en.x, en.y + 30, `vulcan_${Phaser.Math.Between(1, 3)}`);
                b.setVelocityY(400);
                b.setFlipY(true); // Flip downwards
                en.lastFired = Date.now();
                en.shootTimer = Phaser.Math.Between(1500, 3000);
            }
        });

        // Win Condition SL2
        if (this.subLevel === 2) {
            if (this.enemiesDestroyed >= 30 && this.shootersDestroyed >= 15) {
                this.game.events.emit('trigger-terminal');
            }
        }

        // Cleanup
        [this.bullets, this.enemyBullets, this.bossBullets, this.enemies, this.shooterEnemies, this.asteroids, this.mines].forEach(g => {
            g.getChildren().forEach(c => {
                if (c.y > this.scale.height + 100 || c.y < -200) c.destroy();
            });
        });
    }

    shoot(ship) {
        let b = this.bullets.create(ship.x, ship.y - 30, ship.bulletKey);
        b.setVelocityY(-600);
    }

    hitEnemy(bullet, enemy) {
        let exp = this.add.sprite(enemy.x, enemy.y, 'explosion_1_01').setScale(0.8);
        exp.play('vfx_explosion');
        exp.on('animationcomplete', () => exp.destroy());
        
        bullet.destroy();
        enemy.destroy();
        this.enemiesDestroyed++;
        this.updateHUD();
        
        if (this.subLevel === 1 && this.enemiesDestroyed >= 20) {
            this.game.events.emit('trigger-terminal');
        }
    }

    hitShooter(bullet, shooter) {
        let exp = this.add.sprite(shooter.x, shooter.y, 'explosion_2_01').setScale(0.8);
        exp.play('boom_2');
        exp.on('animationcomplete', () => exp.destroy());

        bullet.destroy();
        shooter.destroy();
        this.shootersDestroyed++;
        this.updateHUD();
    }

    detonateMine(bullet, mine) {
        bullet.destroy();
        let exp = this.add.sprite(mine.x, mine.y, 'explosion_3_01').setScale(1.5);
        exp.play('boom_3');
        exp.on('animationcomplete', () => exp.destroy());
        
        // Clear nearby enemies
        [this.enemies, this.shooterEnemies].forEach(g => {
            g.getChildren().forEach(e => {
                if (Phaser.Math.Distance.Between(e.x, e.y, mine.x, mine.y) < 200) {
                    this.hitEnemy(null, e);
                }
            });
        });

        if (this.boss && Phaser.Math.Distance.Between(this.boss.x, this.boss.y, mine.x, mine.y) < 250) {
            this.damageBoss(5);
        }

        mine.destroy();
    }

    damageBoss(amount) {
        if (this.bossDead) return;
        this.boss.hp -= amount;
        this.updateHUD();
        this.cameras.main.shake(200, 0.01);
        
        if (this.boss.hp <= 0) {
            this.bossDeathSequence();
        }
    }

    bossDeathSequence() {
        this.bossDead = true;
        this.boss.setVelocity(0);
        
        for (let i = 0; i < 15; i++) {
            this.time.delayedCall(i * 150, () => {
                let rx = this.boss.x + Phaser.Math.Between(-100, 100);
                let ry = this.boss.y + Phaser.Math.Between(-80, 80);
                let type = Phaser.Math.Between(1, 3);
                let exp = this.add.sprite(rx, ry, `explosion_${type}_01`).setScale(1.5);
                exp.play(type === 1 ? 'vfx_explosion' : (type === 2 ? 'boom_2' : 'boom_3'));
                exp.on('animationcomplete', () => exp.destroy());
            });
        }

        this.time.delayedCall(2500, () => {
            this.boss.destroy();
            this.game.events.emit('trigger-terminal');
        });
    }

    updateHUD() {
        if (this.subLevel === 1) {
            this.scoreText.setText(`DATA CORRUPTED: ${this.enemiesDestroyed} / 20`);
        } else if (this.subLevel === 2) {
            this.scoreText.setText(`SYSTEM BREACH: ${this.enemiesDestroyed}/30 | ${this.shootersDestroyed}/15`);
        } else {
            this.scoreText.setText(`MOTHER-SHIP CORE: ${Math.max(0, this.boss.hp)}%`);
        }

        let p1Bars = '|'.repeat(Math.max(0, this.p1HP));
        let p2Bars = '|'.repeat(Math.max(0, this.p2HP));
        this.hpText.setText(`P1: [${p1Bars.padEnd(3, ' ')}] ${this.p2.active ? ` | P2: [${p2Bars.padEnd(3, ' ')}]` : ''}`);
    }

    handleDeath(player, hazard) {
        if (player.invulnerable) return;

        if (player === this.p1) this.p1HP--;
        else this.p2HP--;

        this.updateHUD();
        if (hazard && hazard.destroy) hazard.destroy();

        if (this.p1HP <= 0 || (this.p2.active && this.p2HP <= 0)) {
            // Full Reset
            this.p1HP = 3; 
            this.p2HP = this.p2.active ? 3 : 0;
            this.enemiesDestroyed = 0;
            this.shootersDestroyed = 0;
            this.crashingSpawned = 0;
            this.shootersSpawned = 0;
            if (this.boss) this.boss.hp = 100;
            this.updateHUD();
            
            this.enemies.clear(true, true);
            this.shooterEnemies.clear(true, true);
            this.asteroids.clear(true, true);
            this.bullets.clear(true, true);
            this.enemyBullets.clear(true, true);
            this.bossBullets.clear(true, true);
            this.mines.clear(true, true);

            this.playersArr.forEach((p, i) => {
                p.setPosition(this.scale.width / 2 + (i === 0 ? -50 : 50), this.scale.height - 100);
            });
        } else {
            // I-Frames
            player.invulnerable = true;
            this.tweens.add({
                targets: player,
                alpha: 0.2,
                duration: 100,
                yoyo: true,
                repeat: 5,
                onComplete: () => {
                    player.invulnerable = false;
                    player.alpha = 1;
                }
            });
        }
    }
}

// ------ MODULE 5: SYNC SURVIVE ------
class SyncSurviveScene extends Phaser.Scene {
    constructor() { super('SyncSurviveScene'); }
    create() { this.add.text(20, 20, 'Sequence Ended.', { fill: '#39ff14', fontSize: '24px' }); }
}

const config = {
    type: Phaser.AUTO, parent: 'game-container', width: '100%', height: '100%',
    backgroundColor: '#0a0a0c', physics: { default: 'arcade', arcade: { debug: false } },
    scene: [BootScene, MenuScene, UIScene, LevelDevilScene, DataFragmentScene, DriftRacingScene, SpaceShooterScene, SyncSurviveScene],
    scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH }
};

const game = new Phaser.Game(config);
