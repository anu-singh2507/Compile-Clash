const GameState = { PLAYING: 'PLAYING', SYSTEM_OVERRIDE: 'SYSTEM_OVERRIDE', VALIDATING: 'VALIDATING' };
const REGISTRY_TEAM_ID = 'teamId'; const REGISTRY_MODULE = 'curModule'; const REGISTRY_SUBLEVEL = 'curSublevel';
const REGISTRY_GAME_RUNNING = 'gameRunning';

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
        this.load.image('grass', 'assets/tilesets/grass.png');
        this.load.image('jigsaw_bg', 'assets/backgrounds/jigsaw_bg.png');
        this.load.image('track_bg', 'assets/backgrounds/track_bg.png');
        this.load.image('race_straight', 'assets/tilesets/race_straight.png');
        this.load.image('race_corner', 'assets/tilesets/race_corner.png');

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
        for (let i = 1; i <= 9; i++) this.load.image(`explosion_2_0${i}`, `assets/shooter/explosion_2_0${i}.png`);

        // MODULE 4 - SL3: Boss & Final Gear
        this.load.image('boss', 'assets/shooter/enemy_boss.png');
        [1, 2, 3].forEach(i => this.load.image(`proton_0${i}`, `assets/shooter/proton_0${i}.png`));
        for (let i = 1; i <= 9; i++) {
            this.load.image(`mine_${i}`, `assets/shooter/mine_11_0${i}.png`);
            this.load.image(`explosion_3_0${i}`, `assets/shooter/explosion_3_0${i}.png`);
        }

        // Vfx
        for (let i = 1; i <= 5; i++) this.load.image(`exhaust_0${i}`, `assets/shooter/exhaust_0${i}.png`);
        for (let i = 1; i <= 11; i++) {
            let n = i < 10 ? `0${i}` : i;
            this.load.image(`explosion_1_${n}`, `assets/shooter/explosion_1_${n}.png`);
        }

        // MODULE 2: Dynamic Jigsaw Assets
        this.load.spritesheet('puzzle_1', 'assets/images/fiery_moon.png', { frameWidth: 250, frameHeight: 140 });
        this.load.image('puzzle_ref_1', 'assets/images/fiery_moon.png');
        this.load.spritesheet('puzzle_2', 'assets/images/beautiful-nature-landscape-top-hill_puzzle.png', { frameWidth: 65, frameHeight: 41 });
        this.load.image('puzzle_ref_2', 'assets/images/beautiful-nature-landscape-top-hill_puzzle.png');
    }

    create() {
        // Setup Player 1 & 2 Animations Globally
        this.anims.create({ key: 'p1_idle', frames: this.anims.generateFrameNumbers('p1', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'p1_walk', frames: this.anims.generateFrameNumbers('p1', { start: 10, end: 17 }), frameRate: 15, repeat: -1 });
        this.anims.create({ key: 'p1_jump', frames: this.anims.generateFrameNumbers('p1', { start: 20, end: 23 }), frameRate: 10 });
        this.anims.create({ key: 'p1_death', frames: this.anims.generateFrameNumbers('p1', { start: 100, end: 109 }), frameRate: 15 });

        // Setup Portal, Spikes and Pads
        this.anims.create({ key: 'portal_swirl', frames: this.anims.generateFrameNumbers('portal'), frameRate: 10, repeat: -1 });
        this.anims.create({ key: 'spike_pop', frames: this.anims.generateFrameNumbers('spike', { start: 0, end: 13 }), frameRate: 20 });
        this.anims.create({ key: 'pad_active', frames: this.anims.generateFrameNumbers('jump_pad'), frameRate: 10, repeat: -1 });

        const storedId = localStorage.getItem('teamId');
        if (storedId) {
            fetch('/api/game-status').then(r => r.json()).then(data => {
                if (data.started) {
                    fetch(`/api/teams/${storedId}/question`).then(r => r.json()).then(q => {
                        this.registry.set(REGISTRY_TEAM_ID, storedId);
                        this.registry.set(REGISTRY_MODULE, parseInt(q.current_level) || 1);
                        this.registry.set(REGISTRY_SUBLEVEL, parseInt(q.current_sublevel) || 1);
                        this.registry.set('activeTimeSeconds', q.active_time_seconds || 0);
                        globalPlayerCount = 2;
                        const overlay = document.getElementById('login-overlay');
                        if (overlay) overlay.classList.add('hidden');
                        this.scene.start('UIScene');
                    }).catch(() => this.scene.start('MenuScene'));
                } else {
                    this.scene.start('MenuScene', { autoWait: true });
                }
            });
        } else {
            this.scene.start('MenuScene');
        }
    }
}

class MenuScene extends Phaser.Scene {
    constructor() { super('MenuScene'); }
    create(data) {
        const overlay = document.getElementById('login-overlay');
        overlay.classList.remove('hidden');

        const regBtn = document.getElementById('btn-register');
        const waitSection = document.getElementById('wait-section');
        const startBtn = document.getElementById('btn-start-session');
        const regContainer = document.getElementById('reg-button-container');

        // Check if we came here from session recovery (auto-wait)
        if (data && data.autoWait) {
            const storedId = localStorage.getItem('teamId');
            if (storedId) {
                this.registry.set(REGISTRY_TEAM_ID, storedId);
                regContainer.classList.add('hidden');
                waitSection.classList.remove('hidden');
                document.getElementById('login-status-msg').innerText = "ACCOUNT RECONNECTED";
                this.startPolling();
            }
        }

        const registerAndWait = () => {
            const name = document.getElementById('team-name-input').value;
            if (!name || name.trim() === '') return alert("Please enter Team Name");

            // Force 2 players
            globalPlayerCount = 2;

            fetch('/api/register', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ team_name: name.trim(), player_count: 2 })
            }).then(r => r.json()).then(data => {
                localStorage.setItem('teamId', data.team_id);
                localStorage.setItem('playerCount', 2);
                localStorage.removeItem('gameStartTime'); // Clear timer for new registration
                this.registry.set(REGISTRY_TEAM_ID, data.team_id);

                // Hide registration, show waiting
                regContainer.classList.add('hidden');
                waitSection.classList.remove('hidden');
                document.getElementById('login-status-msg').innerText = "REGISTRATION SUCCESSFUL";

                // Start polling for admin signal
                this.startPolling();
            }).catch(e => alert("Backend error connecting"));
        };

        if (regBtn) regBtn.onclick = registerAndWait;
        if (startBtn) startBtn.onclick = () => {
            fetch(`/api/teams/${this.registry.get(REGISTRY_TEAM_ID)}/question`).then(r => r.json()).then(q => {
                this.registry.set(REGISTRY_MODULE, parseInt(q.current_level) || 1);
                this.registry.set(REGISTRY_SUBLEVEL, parseInt(q.current_sublevel) || 1);
                this.registry.set('activeTimeSeconds', q.active_time_seconds || 0);
                
                // Set initial startTime if not present
                if (!localStorage.getItem('gameStartTime')) {
                    const sessionStart = Date.now() - ((q.active_time_seconds || 0) * 1000);
                    localStorage.setItem('gameStartTime', sessionStart.toString());
                }
                
                overlay.classList.add('hidden');
                this.scene.start('UIScene');
            });
        };
    }

    startPolling() {
        const startBtn = document.getElementById('btn-start-session');
        this.pollInterval = setInterval(() => {
            fetch('/api/game-status')
                .then(r => r.json())
                .then(data => {
                    if (data.started) {
                        clearInterval(this.pollInterval);
                        if (startBtn) startBtn.classList.remove('hidden');
                        const loader = document.querySelector('.loader-bar');
                        if (loader) loader.classList.add('hidden');
                        const statusText = document.querySelector('.flashing-text');
                        if (statusText) statusText.innerText = "> ADMIN AUTHORIZATION GRANTED. ACCESSING CORE...";
                    }
                });
        }, 1500);
    }
}

const INFO_DATA = {
    1: {
        title: "MODULE 1: GLITCH GRID",
        body: "<ul><li><b>CONTROLS:</b> <b style='color:#ff00ea'>Player 1 (Pink)</b> uses <b>WASD</b>. <b style='color:#00ffff'>Player 2 (Blue)</b> uses <b>ARROWS</b>.</li><li><b>GOAL:</b> Both players must touch the <b>PORTAL</b> at the end.</li><li><b>WARNING:</b> If one player dies, both restart! Avoid the spikes and pits.</li></ul>"
    },
    2: {
        title: "MODULE 2: DATA FRAGMENT",
        body: "<ul><li><b>CONTROLS:</b> Use your <b>MOUSE</b> to drag the pieces.</li><li><b>GOAL:</b> Fix the picture! Move pieces to the empty boxes in the middle.</li><li><b>HELP:</b> Look at the small picture at the top-left if you get stuck.</li></ul>"
    },
    3: {
        title: "MODULE 3: CYBER DRIFT",
        body: "<ul><li><b>CONTROLS:</b> <b style='color:#ff00ea'>Player 1 (Pink)</b> uses <b>WASD</b>. <b style='color:#00ffff'>Player 2 (Blue)</b> uses <b>ARROWS</b>.</li><li> W and Up arrow key accelerates the car, S and Down arrow key brakes the car, A and D keys rotate the car.</li><li><b>GOAL:</b> Drive <b>5 LAPS</b>. You must drive through the middle gate every lap.</li><li><b>WARNING:</b> Bumping into tyres or cones will slow you down. Drive fast!</li></ul>"
    },
    4: {
        title: "MODULE 4: CELESTIAL DEFENDER",
        body: "<ul><li><b>CONTROLS:</b> <b style='color:#ff00ea'>Player 1 (Pink)</b>: WASD + <b>SPACEBAR</b> to shoot. <b style='color:#00ffff'>Player 2 (Blue)</b>: Arrows + <b>ENTER</b> to shoot.</li><li><b>GOAL:</b> Kill the bad guys. At the Boss, shoot the <b>ASTEROIDS</b> to kick them into the Boss!</li><li><b>HEARTS:</b> You have 3 lives total. If one ship breaks, the game resets!</li></ul>"
    }
};

const QUIZ_QUESTIONS = [
    { q: "What is the output of print(type(10/2))?", options: ["int", "float", "str", "NoneType"], a: 1 },
    { q: "Which keyword is used to define a function in Python?", options: ["function", "define", "def", "func"], a: 2 },
    { q: "What does len(\"Hello World\") return?", options: ["10", "11", "12", "Error"], a: 1 },
    { q: "What is the output of print(2 ** 4)?", options: ["6", "8", "16", "24"], a: 2 },
    { q: "Which of these correctly creates a list in Python?", options: ["{1,2,3}", "(1,2,3)", "<1,2,3>", "[1,2,3]"], a: 3 },
    { q: "What does range(2, 6) generate?", options: ["2,3,4,5,6", "2,3,4,5", "1,2,3,4,5", "3,4,5"], a: 1 },
    { q: "What is the output of print(\"Python\"[0])?", options: ["P", "y", "t", "Error"], a: 0 },
    { q: "Which symbol is used for single-line comments in Python?", options: ["//", "/* */", "#", "--"], a: 2 },
    { q: "Which tag is used to create a hyperlink?", options: ["<link>", "<url>", "<a>", "<href>"], a: 2 },
    { q: "Which attribute defines the URL in an anchor tag?", options: ["src", "href", "link", "url"], a: 1 },
    { q: "Which tag creates a horizontal line on a webpage?", options: ["<hl>", "<line>", "<border>", "<hr>"], a: 3 },
    { q: "What does the <br> tag do?", options: ["Makes text bold", "Inserts a line break", "Creates a border", "Adds a background"], a: 1 },
    { q: "Which tag is used to define a row in an HTML table?", options: ["<td>", "<th>", "<tr>", "<row>"], a: 2 },
    { q: "Which tag makes text italic?", options: ["<italic>", "<it>", "<em>", "<i>"], a: 3 },
    { q: "Which tag is used to underline text?", options: ["<ul>", "<u>", "<under>", "<line>"], a: 1 }
];

class UIScene extends Phaser.Scene {
    constructor() { super('UIScene'); }
    create() {
        this.currentState = GameState.PLAYING;
        this.modules = { 1: 'LevelDevilScene', 2: 'DataFragmentScene', 3: 'DriftRacingScene', 4: 'SpaceShooterScene', 5: 'WinScene' };

        // Sync global state from local storage
        globalPlayerCount = parseInt(localStorage.getItem('playerCount')) || 1;

        // Global Instruction Trigger
        this.manualOverlay = document.getElementById('instruction-overlay');
        this.manualTitle = document.getElementById('manual-title');
        this.manualBody = document.getElementById('manual-body');
        this.hudHelp = document.getElementById('hud-help-trigger');

        document.getElementById('btn-manual-dismiss').onclick = () => {
            this.manualOverlay.classList.add('hidden');
            this.scene.resume(this.activeModuleScene);
        };

        const restartBtn = document.getElementById('btn-manual-restart');
        if (restartBtn) {
            restartBtn.onclick = () => {
                this.manualOverlay.classList.add('hidden');
                this.scene.stop(this.activeGameplayScene);
                this.registry.set(REGISTRY_GAME_RUNNING, false);
                this.startActiveGameplayScene();
            };
        }

        document.getElementById('btn-show-help').onclick = () => {
            const mId = this.registry.get(REGISTRY_MODULE);
            this.showManual(mId, true);
        };

        this.events.on('show-manual', (mId) => this.showManual(mId));

        const { width, height } = this.scale;
        this.hudText = this.add.text(20, 20, '', { fontSize: '24px', fill: '#39ff14', fontFamily: 'Courier New', lineSpacing: 10 }).setShadow(0, 0, '#39ff14', 5);

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
        this.registry.set(REGISTRY_GAME_RUNNING, false);
        this.currentState = GameState.PLAYING; 
        
        // Priority 1: Use persistent start time from localStorage (keeps mid-level progress on refresh)
        const stored = localStorage.getItem('gameStartTime');
        const serverTime = this.registry.get('activeTimeSeconds');

        if (stored) {
            console.log(`[CLIENT TIMER] Resuming from localStorage: ${stored}`);
            this.gameStartTime = parseInt(stored);
            this.registry.remove('activeTimeSeconds'); // Consume server data anyway
        } else if (serverTime !== undefined && serverTime !== null) {
            // Priority 2: Sync with server if fresh session or new browser
            console.log(`[CLIENT TIMER] Initializing from server baseline: ${serverTime}s`);
            this.gameStartTime = Date.now() - (serverTime * 1000);
            localStorage.setItem('gameStartTime', this.gameStartTime.toString());
            this.registry.remove('activeTimeSeconds');
        } else {
            // Priority 3: Fresh start
            console.log(`[CLIENT TIMER] Fresh session start.`);
            this.gameStartTime = Date.now();
            localStorage.setItem('gameStartTime', this.gameStartTime.toString());
        }
    }

    update() { this.updateHUD(this.activeGameplayScene); }

    updateHUD(sceneName) {
        const m = parseInt(this.registry.get(REGISTRY_MODULE));
        const sl = parseInt(this.registry.get(REGISTRY_SUBLEVEL));
        const levelNames = { 1: 'GLITCH GRID', 2: 'DATA FRAGMENT', 3: 'CYBER DRIFT', 4: 'CELESTIAL DEFENDER', 5: 'FINISHED' };

        if (m >= 5) {
            this.hudText.setText('');
            if (this.hudHelp) this.hudHelp.classList.add('hidden');
            return;
        }

        const levelName = levelNames[m] || `MODULE ${m}`;
        const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const formatTime = (s) => {
            const h = Math.floor(s / 3600);
            const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
            const sec = (s % 60).toString().padStart(2, '0');
            return h > 0 ? `${h}:${m}:${sec}` : `${m}:${sec}`;
        };
        this.hudText.setText(`${levelName}\nSUBLEVEL: 0${sl}\nTIME: ${formatTime(elapsed)}`);

        if (sceneName) this.activeModuleScene = sceneName;

        // Show help button only during levels
        if (this.hudHelp) this.hudHelp.classList.remove('hidden');

        // Logic to show manual at start of M_S1
        if (sl === 1 && !this.registry.get(`manual_shown_${m}`)) {
            this.registry.set(`manual_shown_${m}`, true);
            this.showManual(m);
        }
    }

    showManual(mId, requested = false) {
        if (!INFO_DATA[mId]) return;
        this.manualTitle.innerText = INFO_DATA[mId].title;
        this.manualBody.innerHTML = INFO_DATA[mId].body;
        this.manualOverlay.classList.remove('hidden');

        if (this.activeModuleScene && this.scene.isActive(this.activeModuleScene)) {
            this.scene.pause(this.activeModuleScene);
        }
    }

    displayCompletionMessage() {
        const { width, height } = this.scale;
        const m = parseInt(this.registry.get(REGISTRY_MODULE));
        const sl = parseInt(this.registry.get(REGISTRY_SUBLEVEL));

        let msgText = "";
        if ((m === 2 && sl === 2) || sl === 3) {
            msgText = `LEVEL ${m} COMPLETED`;
        } else {
            const ord = sl === 1 ? "1ST" : (sl === 2 ? "2ND" : "3RD");
            msgText = `${ord} SUBLEVEL CLEARED`;
        }

        const clearText = this.add.text(width / 2, height / 2 + 80, `> ${msgText} <`, {
            fontSize: '48px', fill: '#39ff14', fontFamily: 'Courier New', fontWeight: 'bold', backgroundColor: '#000000'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(2000);
        clearText.setShadow(0, 0, '#39ff14', 10);

        this.time.delayedCall(1500, () => clearText.destroy());
    }

    triggerSubLevelComplete() {
        if (this.currentState !== GameState.PLAYING) return;
        this.currentState = GameState.VALIDATING; // Prevent further triggers immediately
        this.displayCompletionMessage();

        const m = parseInt(this.registry.get(REGISTRY_MODULE));
        const sl = parseInt(this.registry.get(REGISTRY_SUBLEVEL));
        const whitelist = [[1, 3], [2, 2], [3, 3], [4, 2], [4, 3]];
        const shouldShowTerminal = whitelist.some(w => w[0] === m && w[1] === sl);

        if (shouldShowTerminal) {
            this.time.delayedCall(1500, () => {
                this.currentState = GameState.SYSTEM_OVERRIDE;
                const activeScene = this.scene.get(this.activeGameplayScene);
                if (activeScene && activeScene.physics && activeScene.physics.world) activeScene.physics.world.pause();
                if (activeScene && activeScene.scene) activeScene.scene.pause();

                if (m === 1 && sl === 3) {
                    this.showQuizUI();
                } else if (m === 2 && sl === 2) {
                    this.showTerminalUI();
                } else if (m === 3 && sl === 2) {
                    this.showTerminalUI();
                } else {
                    this.showTerminalUI();
                }
            });
        } else {
            this.time.delayedCall(1500, () => this.autoAdvance());
        }
    }

    showTerminalUI() {
        this.fetchQuestionText();
        const terminal = document.getElementById('compile-clash-terminal');
        terminal.classList.remove('hidden');
        terminal.classList.add('terminal-anim-slide-in');

        document.getElementById('command-input').value = '';
        document.getElementById('next-level-container').classList.add('hidden');
        document.getElementById('submit-code-btn').disabled = false;

        document.getElementById('terminal-body').innerHTML = `<p class="sys-msg">> TEAM HALTED. AWAITING DECRYPTION KEY...</p>`;
    }

    autoAdvance() {
        const id = this.registry.get(REGISTRY_TEAM_ID);
        const { newLevel, newSub } = this.calculateNextLevel();
        const duration_seconds = Math.floor((Date.now() - this.gameStartTime) / 1000);
        console.log(`[CLIENT TIMER] Auto-advancing. Sending duration: ${duration_seconds}s`);

        fetch(`/api/teams/${id}/progress`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ new_level: newLevel, new_sublevel: newSub, score_increment: 100, duration_seconds })
        }).then(() => {
            this.scene.stop(this.activeGameplayScene);
            this.registry.set(REGISTRY_SUBLEVEL, newSub);
            this.registry.set(REGISTRY_MODULE, newLevel);
            this.startActiveGameplayScene();
        });
    }

    performHiddenSkip() {
        if (this.currentState === GameState.PLAYING) {
            this.triggerSubLevelComplete();
        } else if (this.currentState === GameState.SYSTEM_OVERRIDE) {
            this.appendToTerminal(`> [DEBUG] BYPASSING SECURITY LAYER...`);
            let id = this.registry.get(REGISTRY_TEAM_ID);
            const { newLevel, newSub } = this.calculateNextLevel();
            this.registry.set('nextSub', newSub);
            this.registry.set('nextMod', newLevel);
            const duration_seconds = Math.floor((Date.now() - this.gameStartTime) / 1000);
            console.log(`[CLIENT TIMER] Skipping via hidden shortcut. Sending duration: ${duration_seconds}s`);
            fetch(`/api/teams/${id}/progress`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ new_level: newLevel, new_sublevel: newSub, score_increment: 0, duration_seconds })
            }).then(() => {
                document.getElementById('next-level-container').classList.remove('hidden');
                this.appendToTerminal(`> [SUCCESS] SYSTEM BYPASS GRANTED.`, 'sys-msg');
            });
        } else if (!document.getElementById('compile-clash-quiz').classList.contains('hidden')) {
            document.getElementById('compile-clash-quiz').classList.add('hidden');
            this.autoAdvance();
        }
    }

    showWinUI() {
        this.scene.stop(this.activeGameplayScene);
        const { width, height } = this.scale;

        // Darken the screen completely
        const overlay = this.add.rectangle(0, 0, width, height, 0x0a0a0c, 1.0).setOrigin(0).setDepth(3000);

        const style = {
            fontSize: '72px',
            fill: '#39ff14',
            fontStyle: 'bold',
            fontFamily: 'Courier New',
            align: 'center'
        };

        const winText = this.add.text(width / 2, height / 2, 'CONGRATULATIONS!', style).setOrigin(0.5).setDepth(3001).setAlpha(0);
        winText.setShadow(0, 0, '#39ff14', 10);

        // Compatible Chained Sequence: CONGRATS -> FUNSCRIPT -> THANKS
        this.tweens.add({
            targets: winText,
            alpha: 1,
            duration: 1500,
            onComplete: () => {
                this.time.delayedCall(1000, () => {
                    this.tweens.add({
                        targets: winText,
                        alpha: 0,
                        duration: 800,
                        onComplete: () => {
                            winText.setText('FUNSCRIPT').setFontSize(120).setColor('#00ffff');
                            winText.setShadow(0, 0, '#00ffff', 20);
                            this.tweens.add({
                                targets: winText,
                                alpha: 1,
                                duration: 1500,
                                onComplete: () => {
                                    this.time.delayedCall(2000, () => {
                                        this.tweens.add({
                                            targets: winText,
                                            alpha: 0,
                                            duration: 800,
                                            onComplete: () => {
                                                winText.setText('THANKS FOR PLAYING!').setFontSize(48).setColor('#39ff14');
                                                winText.setShadow(0, 0, '#39ff14', 5);
                                                this.tweens.add({
                                                    targets: winText,
                                                    alpha: 1,
                                                    duration: 1000
                                                });
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    });
                });
            }
        });
    }

    calculateNextLevel() {
        let curSub = parseInt(this.registry.get(REGISTRY_SUBLEVEL));
        let curMod = parseInt(this.registry.get(REGISTRY_MODULE));
        let newSub = curSub + 1;
        let newLevel = curMod;

        // Final Game Completion Check: End at L5 S1
        if (curMod === 4 && curSub === 3) {
            return { newLevel: 5, newSub: 1 }; // Final State
        }
        if (curMod >= 5) return { newLevel: 5, newSub: 1 };

        // Special: Remove L2S3
        if (curMod === 2 && curSub === 2) {
            newLevel = 3;
            newSub = 1;
        } else {
            if (newSub > 3) { newSub = 1; newLevel++; }
        }
        return { newLevel, newSub };
    }

    appendToTerminal(text, className = '') {
        const body = document.getElementById('terminal-body');
        // If text contains #, 🔴, or HTML tags, wrap in code-panel for better readability
        const isCode = text.includes('#') || text.includes('🔴') || text.includes('<!DOCTYPE') || text.includes('<html>') || text.includes('<body');
        if (isCode) {
            const div = document.createElement('div');
            div.className = 'code-panel';
            div.innerText = text;
            body.appendChild(div);
        } else {
            const p = document.createElement('p');
            p.innerText = text;
            if (className) p.className = className;
            body.appendChild(p);
        }
        body.scrollTop = body.scrollHeight;
    }

    fetchQuestionText() {
        let id = this.registry.get(REGISTRY_TEAM_ID);
        // Add random nonce to bust any potential caches
        fetch(`/api/teams/${id}/question?t=${Date.now()}`).then(res => res.json()).then(data => {
            if (data.error) this.appendToTerminal(`> ERROR: ${data.error}`, 'error-msg');
            else this.appendToTerminal(`> QUERY PROTOCOL: ${data.question_text}`, 'sys-msg');
        });
    }

    setupHTMLOverlays() {
        if (this.uiBinded) return;
        const submitBtn = document.getElementById('submit-code-btn');
        const nextLevelBtn = document.getElementById('next-level-btn');
        const inputField = document.getElementById('command-input');

        inputField.addEventListener('keydown', (e) => {
            e.stopPropagation();
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = inputField.selectionStart;
                const end = inputField.selectionEnd;
                inputField.value = inputField.value.substring(0, start) + "    " + inputField.value.substring(end);
                inputField.selectionStart = inputField.selectionEnd = start + 4;
            }
        });
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
            const duration_seconds = Math.floor((Date.now() - this.gameStartTime) / 1000);
            console.log(`[CLIENT TIMER] Submitting via terminal. Sending duration: ${duration_seconds}s`);

            fetch(`/api/teams/${id}/submit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ submission: code }) })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        this.appendToTerminal(`> [VERIFIED] ${data.message}`, 'sys-msg');
                        document.getElementById('next-level-container').classList.remove('hidden');

                        const { newLevel, newSub } = this.calculateNextLevel();
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

        this.input.keyboard.on('keydown', (event) => {
            // Shift + 8 (the key containing asterisk)
            if (event.shiftKey && (event.key === '8' || event.code === 'Digit8')) {
                this.performHiddenSkip();
            }
        });
    }

    showQuizUI() {
        this.currentQuizIndex = 0;
        this.quizCorrect = 0;
        this.quizAttempted = 0;

        const quizUI = document.getElementById('compile-clash-quiz');
        quizUI.classList.remove('hidden');
        quizUI.classList.add('terminal-anim-slide-in');

        document.getElementById('quiz-result-container').classList.add('hidden');
        const nextBtn = document.getElementById('quiz-next-btn');
        nextBtn.classList.remove('hidden');
        nextBtn.innerText = "START CHALLENGE";

        document.getElementById('quiz-question-text').innerText = `> SYSTEM BRIEFING: MCQ MODULE INITIALIZED.`;
        const container = document.getElementById('quiz-options-container');
        container.innerHTML = `<p class="sys-msg" style="color: #fff; line-height: 1.6;">Welcome to the Educational Assessment Module.<br><br>• There are <b>15 questions</b> in total (Python & HTML).<br>• You must <b>attempt at least 10 questions</b>.<br>• You need at least <b>8 correct answers</b> to proceed to Level 2.<br><br>Good luck, Team.</p>`;

        nextBtn.onclick = () => {
            this.renderQuizQuestion();
        };
    }

    renderQuizQuestion() {
        const q = QUIZ_QUESTIONS[this.currentQuizIndex];
        document.getElementById('quiz-question-text').innerText = `> [Q ${this.currentQuizIndex + 1}/15] ${q.q}`;
        document.getElementById('quiz-progress').innerText = `Progress: ${this.currentQuizIndex + 1}/15 | Total Attempted: ${this.quizAttempted}`;

        const container = document.getElementById('quiz-options-container');
        container.innerHTML = '';
        this.selectedQuizIndex = null;

        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'cyber-button';
            btn.innerText = `${String.fromCharCode(65 + idx)}) ${opt}`;
            btn.onclick = () => this.handleQuizAnswer(idx);
            container.appendChild(btn);
        });

        const nextBtn = document.getElementById('quiz-next-btn');
        const qNum = this.currentQuizIndex + 1;

        // Dynamic Button State
        if (qNum > 10) {
            // After 10 attempts, allow early finish if nothing selected
            nextBtn.classList.remove('hidden');
            nextBtn.innerText = "COMPLETE EARLY";
            nextBtn.style.background = 'rgba(255, 0, 234, 0.2)';
            nextBtn.style.borderColor = 'var(--neon-pink)';
            nextBtn.style.color = 'var(--neon-pink)';
        } else {
            nextBtn.classList.add('hidden');
            nextBtn.innerText = "CONFIRM & NEXT QUESTION";
            nextBtn.style.background = 'transparent';
            nextBtn.style.borderColor = 'var(--neon-blue)';
            nextBtn.style.color = 'var(--neon-blue)';
        }

        nextBtn.onclick = () => {
            if (this.selectedQuizIndex === null) {
                // Clicking when nothing selected means "Complete Early" (only possible if qNum > 10)
                if (qNum > 10) this.finishQuiz();
                return;
            }

            // Finalize Answer
            this.quizAttempted++;
            if (this.selectedQuizIndex === q.a) this.quizCorrect++;

            this.currentQuizIndex++;
            if (this.currentQuizIndex < QUIZ_QUESTIONS.length) {
                this.renderQuizQuestion();
            } else {
                this.finishQuiz();
            }
        };

        // Cleanup old early button if any remains from previous logic
        const oldEarly = document.getElementById('quiz-early-btn');
        if (oldEarly) oldEarly.remove();
    }

    handleQuizAnswer(selectedIndex) {
        this.selectedQuizIndex = selectedIndex;
        const container = document.getElementById('quiz-options-container');
        const buttons = container.querySelectorAll('button');

        buttons.forEach((btn, idx) => {
            if (idx === selectedIndex) {
                btn.style.borderColor = 'var(--neon-green)';
                btn.style.color = 'var(--neon-green)';
                btn.style.background = 'rgba(57, 255, 20, 0.1)';
                btn.style.boxShadow = '0 0 15px var(--neon-green)';
            } else {
                btn.style.borderColor = 'var(--neon-blue)';
                btn.style.color = 'var(--neon-blue)';
                btn.style.background = 'transparent';
                btn.style.boxShadow = 'none';
            }
        });

        const nextBtn = document.getElementById('quiz-next-btn');
        nextBtn.classList.remove('hidden');

        // Switch to "Confirm" state
        const qNum = this.currentQuizIndex + 1;
        nextBtn.innerText = (qNum === 15) ? "CONFIRM & FINISH" : "CONFIRM & NEXT QUESTION";

        nextBtn.style.background = 'rgba(57, 255, 20, 0.1)';
        nextBtn.style.borderColor = 'var(--neon-green)';
        nextBtn.style.color = 'var(--neon-green)';
    }

    finishQuiz() {
        // Cleanup early button if it exists
        const earlyBtn = document.getElementById('quiz-early-btn');
        if (earlyBtn) earlyBtn.remove();

        const quizUI = document.getElementById('compile-clash-quiz');
        const nextBtn = document.getElementById('quiz-next-btn');
        const resultContainer = document.getElementById('quiz-result-container');
        const finalMsg = document.getElementById('quiz-final-msg');
        const finishBtn = document.getElementById('quiz-finish-btn');

        nextBtn.classList.add('hidden');
        resultContainer.classList.remove('hidden');

        const passed = (this.quizAttempted >= 10 && this.quizCorrect >= 8);
        if (passed) {
            finalMsg.className = 'success-msg';
            finalMsg.innerText = `ASSESSMENT COMPLETE.\nATTEMPTED: ${this.quizAttempted} | CORRECT: ${this.quizCorrect}\n\n[ACCESS GRANTED]`;
            finishBtn.classList.remove('hidden');
            finishBtn.innerText = "PROCEED TO LEVEL 2";
            finishBtn.onclick = () => {
                quizUI.classList.add('hidden');
                this.autoAdvance();
            };
        } else {
            finalMsg.className = 'error-msg';
            const reason = this.quizAttempted < 10 ? `ONLY ${this.quizAttempted} QUESTIONS ATTEMPTED.` : `ONLY ${this.quizCorrect} ANSWERS CORRECT.`;
            finalMsg.innerText = `ASSESSMENT FAILED.\n${reason}\n\n[REQUIRE: 10 ATTEMPTS & 8 CORRECT]`;
            finishBtn.classList.remove('hidden');
            finishBtn.innerText = "RESTART MODULE";
            finishBtn.onclick = () => {
                quizUI.classList.add('hidden');
                this.scene.stop(this.activeGameplayScene);
                this.startActiveGameplayScene();
            };
        }
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
        this.levelCompleteTriggered = false;
        this.p1AtPortal = false;
        this.p2AtPortal = false;

        // Reset sub-level 3 specific flags
        this.inPhase2 = false;
        this.teleported = false;
        this.trollSpikesTriggered = false;
        this.redPortalMovementStarted = false;
        this.chasingStarted = false;
        this.chasingX = 0;
        this.chasingEvent = null;
        this.wave1Event = null;
        this.wave2Event = null;

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
        this.controlsHUD.add(this.add.text(0, 0, "PRESS WASD OR ARROW KEYS TO START", { fontSize: '32px', color: '#00FFFF', fontStyle: 'bold' }).setOrigin(0.5));
        this.input.keyboard.once('keydown', () => { this.tweens.add({ targets: this.controlsHUD, alpha: 0, duration: 1000 }); });

        // Physics Group Setup
        this.platforms = this.physics.add.staticGroup();
        this.trollGroup = this.physics.add.group(); // Dynamic for trolls

        // PLAYER SETUP (Must exist BEFORE generatePath colliders)
        let sx, sy;
        if (this.subLevel === 1) { sx = 100; sy = height - 200; }
        else if (this.subLevel === 2) { sx = width - 230; sy = height / 2 + 100; }
        else { sx = 50; sy = height / 2 - 50; }

        this.player1 = this.physics.add.sprite(sx, sy, 'p1').setScale(4.0);
        this.player1.setCollideWorldBounds(false).body.setSize(18, 28).setOffset(7, 0);
        this.p1Keys = this.input.keyboard.addKeys('W,A,S,D');

        if (globalPlayerCount === 2) {
            let p2sx;
            if (this.subLevel === 1) p2sx = 180;
            else if (this.subLevel === 2) p2sx = width - 260;
            else p2sx = 150;
            this.player2 = this.physics.add.sprite(p2sx, sy, 'p1').setScale(4.0).setTint(0x00ffff);
            this.player2.setCollideWorldBounds(false).body.setSize(18, 28).setOffset(7, 0);
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
    }

    generatePath() {
        const { width, height } = this.scale;
        this.platforms.clear(true, true);
        this.trollGroup.clear(true, true);
        if (this.portal) this.portal.destroy();

        if (this.subLevel === 1) {
            let floorY = height - 32;
            for (let x = 50; x <= 2700; x += 64) {
                let rect = this.add.rectangle(x, floorY, 64, 32, 0x00ffff, 0.3);
                if (x >= 2200 && x < 2400) {
                    this.physics.add.existing(rect, false);
                    rect.body.setImmovable(true).setAllowGravity(false);
                    rect.body.moves = false;
                    this.trollGroup.add(rect);
                } else {
                    this.physics.add.existing(rect, true);
                    this.platforms.add(rect);
                    if (x >= 2600 && x < 2664) this.portalPlatform = rect;
                }
            }
            this.portal = this.physics.add.staticSprite(2650, height - 120, 'portal', 0).setScale(2.5).setTint(0x00ffff);
            this.trapTriggered = false;
        } else if (this.subLevel === 2) {
            // SUB-LEVEL 2: 'NO-JUMP' CORRIDOR & NARROW PIT
            const centerY = height / 2;
            const floorY = centerY + 100;
            const ceilingY = floorY - 250;
            const rightWallW = 150;
            const pitW = 160;
            const pitX = width - rightWallW - pitW;

            // 1. Teal Maze Walls (Main Boundaries)
            let topWall = this.add.rectangle(width / 2, ceilingY - 150, width, 300, 0x00ffff, 0.3);
            this.physics.add.existing(topWall, true); this.platforms.add(topWall);
            let floorWall = this.add.rectangle(pitX / 2, floorY + 160, pitX, 315, 0x00ffff, 0.3);
            this.physics.add.existing(floorWall, true); this.platforms.add(floorWall);
            this.pitFloorY = floorY + 130;
            let pitFloor = this.add.rectangle(pitX + pitW / 2, this.pitFloorY + 150, pitW, 300, 0x00ffff, 0.3);
            this.physics.add.existing(pitFloor, true); this.platforms.add(pitFloor);
            let pitRight = this.add.rectangle(pitX + pitW + rightWallW / 2, centerY, rightWallW, height, 0x00ffff, 0.3);
            this.physics.add.existing(pitRight, true); this.platforms.add(pitRight);
            let pitLeft = this.add.rectangle(pitX - 5, floorY + 30, 10, 60, 0x00ffff, 0.3);
            this.physics.add.existing(pitLeft, true); this.platforms.add(pitLeft);
            
            // Invisible Physics Boundaries (The Yellow Path)
            let invCeil = this.add.rectangle((150 + pitX) / 2, ceilingY, pitX - 150, 10, 0x00ffff, 0);
            this.physics.add.existing(invCeil, true); this.platforms.add(invCeil);
            // Main Floor
            let invFloor = this.add.rectangle((150 + pitX) / 2, floorY, pitX - 150, 10, 0x00ffff, 0);
            this.physics.add.existing(invFloor, true); this.platforms.add(invFloor);

            this.portal = this.physics.add.staticSprite(150, floorY - 40, 'portal', 0).setScale(2.0);
            this.portal.anims.play('portal_swirl', true).setTint(0x00ffff);

            this.floorY = floorY; // Store for wave logic
        } else if (this.subLevel === 3) {
            // SUB-LEVEL 3: THE BROKEN BRIDGE
            const centerY = height / 2;
            const floorY = centerY + 50;
            this.floorY = floorY;

            // 1. Phase 1: Broken Bridge (Neon Cyan Rects)
            let mainFloor = this.add.rectangle(1225, floorY + 100, 2450, 200, 0x00ffff, 0.3);
            this.physics.add.existing(mainFloor, true); this.platforms.add(mainFloor);
            let landingPad = this.add.rectangle(2800, floorY + 100, 200, 200, 0x00ffff, 0.3);
            this.physics.add.existing(landingPad, true); this.platforms.add(landingPad);

            // 3. Troll Spikes (Hidden in Landing Pad)
            this.trollSpikesGroup = this.physics.add.staticGroup();
            for (let x = 2710; x <= 2780; x += 25) {
                let spike = this.trollSpikesGroup.create(x, floorY + 15, 'spike-sprite').setScale(0.5);
                spike.setVisible(false); // Hide initially
                if (spike.body) spike.body.enable = false; // Disable hitbox initially
            }

            // Yellow Portal (SL 1-2 Phase 2)
            this.portal = this.physics.add.staticSprite(2850, floorY - 40, 'portal', 0).setScale(2.0).setTint(0xffff00);
            this.portal.anims.play('portal_swirl', true);

            // 5. Phase 2 Section (The Destination: 850px wide)
            this.phase2Spikes = this.physics.add.staticGroup();

            // Outer Walls
            let leftWall = this.add.rectangle(2980, 600, 20, 1500, 0x00ffff, 0.3);
            this.physics.add.existing(leftWall, true); this.platforms.add(leftWall);
            let rightWall = this.add.rectangle(3870, 600, 20, 1500, 0x00ffff, 0.3);
            this.physics.add.existing(rightWall, true); this.platforms.add(rightWall);

            // Zig-Zag Platforms (Spaced by 200px for 4x character height)
            const pConfigs = [
                { x: 3325, y: 300, w: 650 }, // Tier 1: Gap Right
                { x: 3525, y: 500, w: 650 }, // Tier 2: Gap Left
                { x: 3325, y: 700, w: 650 }, // Tier 3: Gap Right
                { x: 3525, y: 900, w: 650 }, // Tier 4: Gap Left
                { x: 3425, y: 1100, w: 850 } // Bottom Floor (3000 to 3850)
            ];
            pConfigs.forEach(p => {
                let rect = this.add.rectangle(p.x, p.y + 10, p.w, 20, 0x00ffff, 0.3);
                this.physics.add.existing(rect, true); this.platforms.add(rect);
            });

            // Spike Bed at Bottom (3600 to 3850)
            for (let x = 3610; x <= 3850; x += 25) {
                let spike = this.phase2Spikes.create(x, 1100 - 15, 'spike-sprite').setScale(0.25);
                spike.body.setSize(4, 4).setOffset(14, 14);
            }

            // RED PORTAL (Final Gate)
            this.redPortal = this.physics.add.staticSprite(3050, 1050, 'portal', 0).setScale(2.0).setTint(0xff0000);
            this.redPortal.anims.play('portal_swirl', true);
            this.redPortalMovementStarted = false;
        }
    }

    update() {
        if (this.p1DeathFlag) return;

        // Move-to-Start Logic
        if (!this.registry.get(REGISTRY_GAME_RUNNING)) {
            const keys = [this.p1Keys.W, this.p1Keys.A, this.p1Keys.S, this.p1Keys.D];
            if (this.p2Keys) {
                keys.push(this.p2Keys.up, this.p2Keys.down, this.p2Keys.left, this.p2Keys.right);
            }
            if (keys.some(k => k && k.isDown)) {
                this.registry.set(REGISTRY_GAME_RUNNING, true);
                const ui = this.scene.get('UIScene');
                if (ui) ui.startTime = Date.now();
            } else {
                this.player1.setVelocity(0);
                if (this.player2) this.player2.setVelocity(0);
                return;
            }
        }

        if (this.scene.get('UIScene').currentState !== GameState.PLAYING) return;

        let p1XVel = 0; let p2XVel = 0;
        if (this.p1Keys.A.isDown) p1XVel = -300;
        else if (this.p1Keys.D.isDown) p1XVel = 300;

        if (globalPlayerCount === 2 && this.p2Keys) {
            if (this.p2Keys.left.isDown) p2XVel = -300;
            else if (this.p2Keys.right.isDown) p2XVel = 300;
        }

        if (!this.hasMovedForward && (p1XVel > 0 || p2XVel > 0)) this.hasMovedForward = true;

        this.player1.setVelocityX(p1XVel);
        if (p1XVel !== 0) this.player1.setFlipX(p1XVel < 0);

        // ✅ Ground check FIRST, before any animation decision
        let p1TouchesDown = this.player1.body.touching.down || this.player1.body.blocked.down;
        if (p1TouchesDown) this.player1.lastGroundedTime = this.time.now;

        if (!this.player1.isDying) {
            if (Phaser.Input.Keyboard.JustDown(this.p1Keys.W) && (p1TouchesDown || (this.time.now - this.player1.lastGroundedTime < 100))) {
                this.player1.setVelocityY(-550);
                this.player1.anims.play('p1_jump', true);
            } else if (p1TouchesDown) {
                // ✅ Only play idle/walk on ground — never overwrite jump while airborne
                this.player1.anims.play(p1XVel !== 0 ? 'p1_walk' : 'p1_idle', true);
            }
        }

        if (globalPlayerCount === 2 && this.player2 && this.player2.active) {
            this.player2.setVelocityX(p2XVel);
            if (p2XVel !== 0) this.player2.setFlipX(p2XVel < 0);

            // ✅ Same fix for P2
            let p2TouchesDown = this.player2.body.touching.down || this.player2.body.blocked.down;
            if (p2TouchesDown) this.player2.lastGroundedTime = this.time.now;

            if (!this.player2.isDying) {
                if (Phaser.Input.Keyboard.JustDown(this.p2Keys.up) && (p2TouchesDown || (this.time.now - this.player2.lastGroundedTime < 100))) {
                    this.player2.setVelocityY(-550);
                    this.player2.anims.play('p1_jump', true);
                } else if (p2TouchesDown) {
                    // ✅ Only play idle/walk on ground
                    this.player2.anims.play(p2XVel !== 0 ? 'p1_walk' : 'p1_idle', true);
                }
            }
        }

        // Section 4: Triggered Simple Decay
        if (this.subLevel === 1) {
            if (this.hasMovedForward) {
                this.decayX += 1.4;
                this.platforms.getChildren().forEach(p => {
                    if (p.x < this.decayX && p !== this.portalPlatform) p.destroy();
                });
            }
            if (!this.trapTriggered && this.trollGroup.getChildren().length > 0) {
                if (this.player1.x > 2120 || (this.player2 && this.player2.active && this.player2.x > 2120)) {
                    this.trapTriggered = true;
                    this.trollGroup.getChildren().forEach(block => {
                        block.body.moves = true;
                        block.body.setImmovable(false).setAllowGravity(true).setVelocityY(600);
                    });
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
                        this.wave1X += 35;
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
                        this.wave2X -= 40;
                    },
                    loop: true
                });
            }

            this.physics.overlap(this.player1, this.spikeStormGroup, () => this.handleDeath(this.player1));
            if (globalPlayerCount === 2 && this.player2) {
                this.physics.overlap(this.player2, this.spikeStormGroup, () => this.handleDeath(this.player2));
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

            // Troll Red Portal (Moves across spikes)
            let p1Moved = Math.abs(this.player1.x - 3050) > 10;
            let p2Moved = this.player2 ? Math.abs(this.player2.x - 3090) > 10 : false;
            if (this.inPhase2 && (p1Moved || p2Moved) && !this.redPortalMovementStarted) {
                this.redPortalMovementStarted = true;
                this.tweens.add({ 
                    targets: this.redPortal, x: 3800, duration: 25000, ease: 'Linear',
                    onUpdate: () => { if (this.redPortal && this.redPortal.active) this.redPortal.refreshBody(); }
                });
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
                        if (this.chasingX >= 2350) { if (this.chasingEvent) this.chasingEvent.remove(); return; }
                        this.spawnWaveSpike(this.chasingX, floorY, true, true);
                        this.chasingX += 35;
                    },
                    loop: true
                });
            }

            if (!this.trollSpikesTriggered) {
                let p1Mid = this.player1.x > 2550 && this.player1.x < 2650;
                let p2Mid = (this.player2) ? (this.player2.x > 2550 && this.player2.x < 2650) : false;
                if (p1Mid || p2Mid) {
                    this.trollSpikesTriggered = true;
                    this.trollSpikesGroup.getChildren().forEach(s => {
                        s.setVisible(true); if (s.body) s.body.enable = true;
                        this.tweens.add({ targets: s, y: floorY - 15, duration: 100, ease: 'Power2' });
                    });
                    // Retract after 2s
                    this.time.delayedCall(2000, () => {
                        this.trollSpikesGroup.getChildren().forEach(s => {
                            this.tweens.add({
                                targets: s, y: floorY + 15, duration: 500, onComplete: () => {
                                    s.setVisible(false); if (s.body) s.body.enable = false;
                                }
                            });
                        });
                    });
                }
            }

            this.physics.overlap(this.player1, [this.chasingSpikesGroup, this.trollSpikesGroup], () => this.handleDeath(this.player1));
            if (this.player2) this.physics.overlap(this.player2, [this.chasingSpikesGroup, this.trollSpikesGroup], () => this.handleDeath(this.player2));

            if (this.inPhase2) {
                let avgY = (this.player2) ? (this.player1.y + this.player2.y) / 2 : this.player1.y;
                this.cameras.main.scrollY += (avgY - 200 - this.cameras.main.scrollY) * 0.1;

                this.physics.overlap(this.player1, this.phase2Spikes, () => this.handleDeath(this.player1));
                if (this.player2) this.physics.overlap(this.player2, this.phase2Spikes, () => this.handleDeath(this.player2));
            } else {
                this.cameras.main.scrollY = 0;
            }

            let targetX = (this.player2) ? (this.player1.x + this.player2.x) / 2 : this.player1.x;
            this.cameras.main.scrollX += (targetX - width / 2 - this.cameras.main.scrollX) * 0.1;
        }

        let maxDepth = (this.subLevel === 3 && this.inPhase2) ? 1500 : this.scale.height;
        if (this.player1.y > maxDepth) {
            this.handleDeath(this.player1);
        } else if (this.player2 && this.player2.y > maxDepth) {
            this.handleDeath(this.player2);
        }

        if (this.portal && this.subLevel < 3 && !this.levelCompleteTriggered) {
            // P1 Check
            if (!this.p1AtPortal && this.physics.overlap(this.player1, this.portal)) {
                this.p1AtPortal = true;
                this.player1.setActive(false).setVisible(false);
                if (this.player1.body) this.player1.body.enable = false;
            }

            // P2 Check
            if (globalPlayerCount === 2 && this.player2 && !this.p2AtPortal && this.physics.overlap(this.player2, this.portal)) {
                this.p2AtPortal = true;
                this.player2.setActive(false).setVisible(false);
                if (this.player2.body) this.player2.body.enable = false;
            }

            const canFinish = (globalPlayerCount === 2) ? (this.p1AtPortal && this.p2AtPortal) : this.p1AtPortal;

            if (canFinish) {
                this.levelCompleteTriggered = true;
                this.game.events.emit('trigger-terminal');
            }
        }
    }

    handleFallingPlatform(player, platform) {
        if (!platform.falling) {
            platform.falling = true;
            this.tweens.add({ targets: platform, alpha: 0, duration: 400, onComplete: () => platform.destroy() });
            this.time.delayedCall(200, () => { if (platform.body) platform.disableBody(true, false); });
        }
    }

    handleDeath(victimPlayer) {
        if (this.p1DeathFlag) return;
        this.p1DeathFlag = true;

        const victimName = (victimPlayer === this.player1) ? "PLAYER 1" : "PLAYER 2";

        this.player1.setVelocity(0, 0).setTint(0xff0000);
        if (globalPlayerCount === 2 && this.player2) this.player2.setVelocity(0, 0).setTint(0xff0000);

        const { width, height } = this.scale;
        const msg = this.add.text(width / 2, height / 2, `${victimName} DIED!\nRESTARTING LEVEL..`, {
            fontSize: '40px', fill: '#ff0000', fontFamily: 'Courier New', align: 'center', fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(2000).setShadow(0, 0, '#ff0000', 10).setScrollFactor(0);

        this.time.delayedCall(2000, () => {
            msg.destroy();
            this.p1DeathFlag = false;
            this.player1.clearTint();
            if (this.player2) this.player2.clearTint();
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
                sx = 100; sy = height - 200;
            } else if (this.subLevel === 2) {
                sx = width - 230; sy = height / 2 + 100;
            } else {
                sx = 100; sy = height / 2 - 50;
            }

            this.player1.setPosition(sx, sy).setVelocity(0, 0).clearTint().setActive(true).setVisible(true);
            if (this.player1.body) this.player1.body.enable = true;
            if (globalPlayerCount === 2 && this.player2) {
                let p2sx = sx + 40;
                this.player2.setPosition(p2sx, sy).setVelocity(0, 0).setTint(0x00ffff).setActive(true).setVisible(true);
                if (this.player2.body) this.player2.body.enable = true;
            }
            this.p1AtPortal = false;
            this.p2AtPortal = false;

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
        this.player1.setPosition(tx, ty).setVelocity(0, 0);
        if (this.player2) this.player2.setPosition(tx + 40, ty).setVelocity(0, 0);

        this.physics.world.setBounds(0, -1000, 5000, 2500);
        this.cameras.main.setBounds(0, -500, 5000, 2500);
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
        this.add.image(width / 2, height / 2, 'jigsaw_bg').setDisplaySize(width, height).setAlpha(0.5);
        this.subLevel = parseInt(this.registry.get(REGISTRY_SUBLEVEL)) || 1;

        // Dynamic Config
        if (this.subLevel === 1) {
            this.cols = 4; this.rows = 4;
            this.pieceW = 180; this.pieceH = 100;
            this.imgKey = 'puzzle_1'; this.refKey = 'puzzle_ref_1';
        } else {
            this.cols = 8; this.rows = 8;
            this.pieceW = 90; this.pieceH = 50;
            this.imgKey = 'puzzle_2'; this.refKey = 'puzzle_ref_2';
        }

        // 1. Reference Image (Top Center) - Replaces the old module text
        let refScale = this.subLevel === 1 ? 0.4 : 0.6;
        this.add.image(width / 2, 130, this.refKey).setScale(refScale).setAlpha(0.6);

        // 2. Automated Target Grid Generation (Centered & Lowered)
        const totalGridW = this.cols * this.pieceW;
        const totalGridH = this.rows * this.pieceH;
        let startX = (width / 2) - (totalGridW / 2);
        let startY = (height / 2) - (totalGridH / 2) + 120;

        this.targets = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                let tx = startX + (c * this.pieceW) + (this.pieceW / 2);
                let ty = startY + (r * this.pieceH) + (this.pieceH / 2);
                this.targets.push({ x: tx, y: ty });
                this.add.rectangle(tx, ty, this.pieceW, this.pieceH).setStrokeStyle(1, 0x00ffff, 0.3);
            }
        }

        // 3. Spawning Pieces (Scattered Left/Bottom)
        this.piecesPlaced = 0;
        let totalPieces = this.cols * this.rows;
        for (let i = 0; i < totalPieces; i++) {
            // Spawn pieces in a column on the left
            let rx = Phaser.Math.Between(50, startX - 80);
            let ry = Phaser.Math.Between(150, height - 100);
            let piece = this.add.sprite(rx, ry, this.imgKey, i).setInteractive({ draggable: true });
            piece.setDisplaySize(this.pieceW, this.pieceH); // Scale high-res pieces down to playable size
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
                    this.add.text(width / 2, height / 2 - 80, '> DATA RESTORED <', {
                        fontSize: '48px', fill: '#39ff14', fontStyle: 'bold', fontFamily: 'Courier New', backgroundColor: '#000000'
                    }).setOrigin(0.5).setDepth(2001);
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
        this.add.tileSprite(0, 0, width, height, 'grass').setOrigin(0);
        this.subLevel = parseInt(this.registry.get(REGISTRY_SUBLEVEL)) || 1;
        this.physics.world.gravity.y = 0;

        // 1. Retro Scanning Grid (Background for Empty Space/World)
        this.gridGraphics = this.add.graphics().setDepth(96); // High depth for Sublevel 3 visibility
        this.gridOffset = 0;

        // 1.1 Hitbox Debug Graphics (Unmasked)
        this.debugGraphics = this.add.graphics().setDepth(100);

        // 2. Curved Track Construction
        const roadScale = 2.0;
        let trackW = width - 280;
        let trackH = height - 280;
        const l = width / 2 - trackW / 2;
        const r = width / 2 + trackW / 2;
        const t = height / 2 - trackH / 2;
        const b = height / 2 + trackH / 2;

        // ✅ Read REAL texture dimensions — no more magic numbers
        const cornerTex = this.textures.get('race_corner').getSourceImage();
        const straightTex = this.textures.get('race_straight').getSourceImage();

        const cw = cornerTex.width * roadScale;   // scaled corner width
        const ch = cornerTex.height * roadScale;  // scaled corner height

        // race_straight.png is portrait (67×94): width=67, height=94
        // At angle 0 (top/bottom): tile is 67px wide, 94px tall → step in X by width
        // At angle 90 (left/right): tile is 94px wide, 67px tall → step in Y by height
        const sTileW = straightTex.width * roadScale;   // 67 * 2 = 134 — horizontal step
        const sTileH = straightTex.height * roadScale;  // 94 * 2 = 188 — vertical step

        // Corners
        this.add.image(l, t, 'race_corner').setScale(roadScale).setOrigin(0.5);            // TL
        this.add.image(r, t, 'race_corner').setScale(roadScale).setOrigin(0.5).setAngle(90);  // TR
        this.add.image(r, b, 'race_corner').setScale(roadScale).setOrigin(0.5).setAngle(180); // BR
        this.add.image(l, b, 'race_corner').setScale(roadScale).setOrigin(0.5).setAngle(270); // BL

        // ✅ Helper: tiles N times evenly between two points (no overlap, no gap)
        const tileBetween = (fromEdge, toEdge, fixedCoord, axis, texKey, angle) => {
            const span = toEdge - fromEdge;
            const tileStep = sTileW;
            // ✅ ceil instead of round — never rounds down, so tiles always meet or slightly overlap
            const count = Math.max(1, Math.ceil(span / tileStep));
            const actualStep = span / count;
            for (let i = 0; i < count; i++) {
                const pos = fromEdge + actualStep * (i + 0.5);
                const x = axis === 'x' ? pos : fixedCoord;
                const y = axis === 'x' ? fixedCoord : pos;
                this.add.image(x, y, texKey).setScale(roadScale).setOrigin(0.5).setAngle(angle);
            }
        };

        // ✅ Straights — start/end exactly at inner corner edge
        // ✅ FIX 2: Add a small bleed (8px) at junctions so corners and straights overlap slightly
        const bleed = 8;
        tileBetween(l + cw / 2 - bleed, r - cw / 2 + bleed, t, 'x', 'race_straight', 0);    // Top
        tileBetween(l + cw / 2 - bleed, r - cw / 2 + bleed, b, 'x', 'race_straight', 180);  // Bottom
        tileBetween(t + ch / 2 - bleed, b - ch / 2 + bleed, l, 'y', 'race_straight', -90);  // Left
        tileBetween(t + ch / 2 - bleed, b - ch / 2 + bleed, r, 'y', 'race_straight', 90);   // Right

        // 3. Collision Boundaries
        this.walls = this.physics.add.staticGroup();

        // Simple Rectangular Outer Bounds (Large enough to contain everything)
        const debugColor = 0xff0000;
        const debugAlpha = 0; // Invisible again
        this.walls.add(this.add.rectangle(0, -50, width, 100, debugColor, debugAlpha).setOrigin(0)); // Top
        this.walls.add(this.add.rectangle(0, height - 50, width, 100, debugColor, debugAlpha).setOrigin(0)); // Bottom
        this.walls.add(this.add.rectangle(-50, 0, 100, height, debugColor, debugAlpha).setOrigin(0)); // Left
        this.walls.add(this.add.rectangle(width - 50, 0, 100, height, debugColor, debugAlpha).setOrigin(0)); // Right

        // Inner Island (Pointy / Rectangular)
        const innerW = trackW - 160;
        const innerH = trackH - 160;
        this.islandVisual = this.add.graphics({ fillStyle: { color: 0x000000, alpha: 0.85 } });
        this.islandVisual.fillRect(width / 2 - innerW / 2, height / 2 - innerH / 2, innerW, innerH);
        this.islandVisual.setDepth(95);

        // Physics for Island (Simple Rectangle)
        let islandPhysics = this.add.rectangle(width / 2, height / 2, innerW, innerH, debugColor, debugAlpha);
        this.physics.add.existing(islandPhysics, true);
        this.walls.add(islandPhysics);

        // Grid Masking
        const mask = this.islandVisual.createGeometryMask();
        this.gridGraphics.setMask(mask);

        // 4. Center HUD (Empty Space)
        this.centerHUD = this.add.container(width / 2, height / 2).setDepth(100); // Higher than darkOverlay
        this.hudBg = this.add.rectangle(0, 0, 280, 160, 0x000000, 0.6).setStrokeStyle(2, 0x00ffff);
        this.hudTitle = this.add.text(0, -60, 'TRACK TELEMETRY', { fontSize: '18px', fill: '#00ffff', fontStyle: 'bold', fontFamily: 'Courier New' }).setOrigin(0.5);
        this.p1Stats = this.add.text(0, -20, 'P1 - LAP: 1/5 | TIME: 0.0s', { fontSize: '16px', fill: '#39ff14', fontFamily: 'Courier New' }).setOrigin(0.5);
        this.p2Stats = this.add.text(0, 10, 'P2 - LAP: 1/5 | TIME: 0.0s', { fontSize: '16px', fill: '#00ffff', fontFamily: 'Courier New' }).setOrigin(0.5);
        this.raceTimeText = this.add.text(0, 50, 'TOTAL: 00:00', { fontSize: '22px', fill: '#ffffff', fontFamily: 'Courier New', fontWeight: 'bold' }).setOrigin(0.5);
        this.centerHUD.add([this.hudBg, this.hudTitle, this.p1Stats, this.p2Stats, this.raceTimeText]);

        this.raceComplete = false;
        this.p1Finished = false;
        this.p2Finished = false;
        this.p1FinalTime = "";
        this.p2FinalTime = "";

        // Finish Line
        this.lapLine = this.add.rectangle(width / 2, b, 50, 250, 0x39ff14, 0.5);
        this.physics.add.existing(this.lapLine, true);
        this.checkpoint = this.add.rectangle(width / 2, t, 50, 250, 0x000000, 0);
        this.physics.add.existing(this.checkpoint, true);

        // HUD - Redundant lap tracker removal handled below in initialization
        this.lapText = { setText: () => { } };

        this.startTime = 0;
        this.p1LapStart = 0;
        this.p2LapStart = 0;

        // Start Prompt
        this.controlsHUD = this.add.container(width / 2, height / 2).setScrollFactor(0).setDepth(200);
        this.controlsHUD.add(this.add.text(0, -100, "PRESS WASD OR ARROW KEYS TO START", { fontSize: '32px', color: '#00FFFF', fontStyle: 'bold' }).setOrigin(0.5));
        this.input.keyboard.once('keydown', () => { this.tweens.add({ targets: this.controlsHUD, alpha: 0, duration: 800 }); });


        // Hazard Spawning
        this.obstacles = this.physics.add.staticGroup();
        if (this.subLevel >= 2) {
            const spawnedCoords = [];
            for (let i = 0; i < 20; i++) {
                let rx, ry, isValid = false, attempts = 0;
                while (!isValid && attempts < 100) {
                    attempts++;
                    rx = Phaser.Math.Between(50, width - 50);
                    ry = Phaser.Math.Between(50, height - 50);

                    // Check if inside inner island (centered)
                    let inIsland = (rx > width / 2 - innerW / 2 - 20 && rx < width / 2 + innerW / 2 + 20 &&
                        ry > height / 2 - innerH / 2 - 20 && ry < height / 2 + innerH / 2 + 20);

                    // Check if on road (outside lane)
                    let distToP1Center = Phaser.Math.Distance.Between(rx, ry, width / 2, b - 15);
                    let nearStart = distToP1Center < 250;
                    let tooClose = spawnedCoords.some(c => Phaser.Math.Distance.Between(rx, ry, c.x, c.y) < 100);

                    if (!inIsland && !nearStart && !tooClose) isValid = true;
                }

                if (isValid) {
                    spawnedCoords.push({ x: rx, y: ry });
                    let key = Math.random() > 0.5 ? 'tyres' : 'cone';
                    let scale = (key === 'tyres') ? 0.04 : 0.05;
                    let obs = this.obstacles.create(rx, ry, key).setScale(scale);

                    // Tighten Hitbox (Match visible foot print)
                    // ✅ displayWidth/Height already accounts for scale — these are real world pixels
                    const fraction = (key === 'tyres') ? 0.6 : 0.4;
                    const bw = obs.displayWidth * fraction;
                    const bh = obs.displayHeight * fraction;
                    obs.body.setSize(bw, bh);
                    // Center the smaller body on the sprite
                    obs.body.setOffset(
                        (obs.displayWidth - bw) / 2,
                        (obs.displayHeight - bh) / 2
                    );
                    obs.refreshBody();
                }
            }
        }

        // 3. Cars
        this.p1 = this.createCar(width / 2, b - 15, 0x39ff14, this.input.keyboard.addKeys('W,A,S,D'));
        this.p2 = this.createCar(width / 2, b + 15, 0x00ffff, this.input.keyboard.createCursorKeys());

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
        container.body.setDrag(0.98);
        container.body.setBounce(0.55);
        const carW = sprite.displayWidth * 0.6;
        const carH = sprite.displayHeight * 0.6;
        container.body.setSize(carW, carH);
        container.body.setOffset(-carW / 2, -carH / 2);

        container.ctrls = keys;
        container.passedCheckpoint = false;
        return container;
    }

    update() {
        if (!this.p1 || !this.p1.ctrls) return;

        // Move-to-Start Logic
        if (!this.registry.get(REGISTRY_GAME_RUNNING)) {
            const keys = [this.p1.ctrls.W, this.p1.ctrls.A, this.p1.ctrls.S, this.p1.ctrls.D,
            this.p2.ctrls.up, this.p2.ctrls.down, this.p2.ctrls.left, this.p2.ctrls.right];
            if (keys.some(k => k.isDown)) {
                this.registry.set(REGISTRY_GAME_RUNNING, true);
                this.startTime = this.time.now;
                this.p1LapStart = this.time.now;
                this.p2LapStart = this.time.now;
            } else {
                return;
            }
        }

        this.driveCar(this.p1, this.p1.ctrls.W, this.p1.ctrls.S, this.p1.ctrls.A, this.p1.ctrls.D);
        this.driveCar(this.p2, this.p2.ctrls.up, this.p2.ctrls.down, this.p2.ctrls.left, this.p2.ctrls.right);

        const { width, height } = this.scale;
        this.gridGraphics.clear();
        this.gridGraphics.lineStyle(1, 0x00ffff, 0.15);
        this.gridOffset = (this.gridOffset + 0.5) % 100;

        for (let x = this.gridOffset; x < width; x += 100) {
            this.gridGraphics.moveTo(x, 0);
            this.gridGraphics.lineTo(x, height);
        }
        for (let y = this.gridOffset; y < height; y += 100) {
            this.gridGraphics.moveTo(0, y);
            this.gridGraphics.lineTo(width, y);
        }
        this.gridGraphics.strokePath();

        // 2. Center HUD Updates
        if (!this.raceComplete) {
            const elapsed = (this.time.now - this.startTime) / 1000;
            const mm = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const ss = Math.floor(elapsed % 60).toString().padStart(2, '0');
            this.raceTimeText.setText(`TOTAL: ${mm}:${ss}`);
        }

        if (!this.p1Finished) {
            const p1LapTime = (this.time.now - this.p1LapStart) / 1000;
            this.p1Stats.setText(`P1 - LAP: ${this.p1.laps + 1}/5 | TIME: ${p1LapTime.toFixed(1)}s`);
            if (this.p1.laps >= 5) {
                this.p1Finished = true;
                this.p1FinalTime = p1LapTime.toFixed(1);
                this.p1Stats.setText(`P1 - FINISHED | TIME: ${this.p1FinalTime}s`);
            }
        }

        if (!this.p2Finished) {
            const p2LapTime = (this.time.now - this.p2LapStart) / 1000;
            this.p2Stats.setText(`P2 - LAP: ${this.p2.laps + 1}/5 | TIME: ${p2LapTime.toFixed(1)}s`);
            if (this.p2.laps >= 5) {
                this.p2Finished = true;
                this.p2FinalTime = p2LapTime.toFixed(1);
                this.p2Stats.setText(`P2 - FINISHED | TIME: ${this.p2FinalTime}s`);
            }
        }

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
        if (car.laps >= 5) {
            car.body.setAcceleration(0);
            car.body.setVelocity(car.body.velocity.x * 0.95, car.body.velocity.y * 0.95);
            car.body.setAngularVelocity(0);
            return;
        }

        // 1. Steering
        if (left.isDown) car.body.setAngularVelocity(-240);
        else if (right.isDown) car.body.setAngularVelocity(240);
        else car.body.setAngularVelocity(0);

        // 2. Lateral Friction (Grip)
        // Project current velocity onto the car's right-hand vector
        const angle = car.rotation;
        const rx = Math.cos(angle + Math.PI / 2);
        const ry = Math.sin(angle + Math.PI / 2);

        // Dot product of velocity and right vector = lateral speed
        const v = car.body.velocity;
        const lateralSpeed = v.x * rx + v.y * ry;

        // Apply counter-force to lateral velocity (Grip)
        // Default grip is high (0.8), reduces to 0.96 during hard turns for drifting
        const isTurning = left.isDown || right.isDown;
        const grip = isTurning ? 0.96 : 0.85;

        const lateralImpulseX = -rx * lateralSpeed * (1 - grip);
        const lateralImpulseY = -ry * lateralSpeed * (1 - grip);

        car.body.velocity.x += lateralImpulseX;
        car.body.velocity.y += lateralImpulseY;

        // 3. Acceleration / Braking
        if (up.isDown) {
            this.physics.velocityFromRotation(angle, 400, car.body.acceleration);
        } else if (down.isDown) {
            this.physics.velocityFromRotation(angle, -250, car.body.acceleration);
        } else {
            car.body.setAcceleration(0);
        }
    }

    handleLap(car) {
        if (car.passedCheckpoint) {
            car.laps++;
            car.passedCheckpoint = false;

            if (car === this.p1) this.p1LapStart = this.time.now;
            else this.p2LapStart = this.time.now;

            // Sync both HUDs
            this.lapText.setText(`P1 Laps: ${this.p1.laps}/5 | P2 Laps: ${this.p2.laps}/5`);

            if (this.p1.laps >= 5 && (globalPlayerCount < 2 || this.p2.laps >= 5) && !this.raceComplete) {
                this.raceComplete = true;
                const { width, height } = this.scale;
                this.add.text(width / 2, height / 2 - 80, '> RACE COMPLETE <', {
                    fontSize: '64px', fill: '#39ff14', fontStyle: 'bold', backgroundColor: '#000000'
                }).setOrigin(0.5).setScrollFactor(0).setDepth(2001);
                console.log("RACE FINISHED - EMITTING TERMINAL TRIGGER");
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
        this.maxLives = this.subLevel; // SL1=1, SL2=2, SL3=3
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
                frames: Array.from({ length: 11 }, (_, i) => ({ key: `explosion_1_${(i + 1) < 10 ? '0' + (i + 1) : (i + 1)}` })),
                frameRate: 20, repeat: 0
            });
            this.anims.create({
                key: 'boom_2',
                frames: Array.from({ length: 9 }, (_, i) => ({ key: `explosion_2_0${i + 1}` })),
                frameRate: 20, repeat: 0
            });
            this.anims.create({
                key: 'mine_spin',
                frames: Array.from({ length: 9 }, (_, i) => ({ key: `mine_${i + 1}` })),
                frameRate: 15, repeat: -1
            });
            this.anims.create({
                key: 'boom_3',
                frames: Array.from({ length: 9 }, (_, i) => ({ key: `explosion_3_0${i + 1}` })),
                frameRate: 20, repeat: 0
            });
        }

        // 3. Groups & Stats
        this.playersArr = [];
        this.p1HP = this.maxLives;
        this.p2HP = (globalPlayerCount === 2) ? this.maxLives : 0;

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
            this.boss = this.physics.add.sprite(width / 2, 110, 'boss').setScale(0.7).setImmovable(true);
            this.bossBar = this.add.graphics().setDepth(100);
            this.boss.setDepth(40);
            // Increased hitbox to match visual sprite better
            this.boss.body.setSize(this.boss.width * 0.9, this.boss.height * 0.8);
            this.boss.body.setOffset(this.boss.width * 0.05, this.boss.height * 0.1);
            this.boss.hp = 100; this.boss.maxHp = 100;
            this.bossDead = false;
        }

        // 5. Hazards Timers (Paused initially)
        let asteroidDelay = 1500;
        this.spawnTimerAsteroid = this.time.addEvent({ delay: asteroidDelay, callback: this.spawnAsteroid, callbackScope: this, loop: true, paused: true });
        this.spawnTimerEnemy = this.time.addEvent({ delay: 2000, callback: this.spawnEnemy, callbackScope: this, loop: true, paused: true });

        if (this.subLevel === 2) {
            this.spawnTimerShooter = this.time.addEvent({ delay: 3000, callback: this.spawnShooter, callbackScope: this, loop: true, paused: true });
        }
        if (this.subLevel === 3) {
            this.spawnTimerMine = this.time.addEvent({ delay: 4000, callback: this.spawnMine, callbackScope: this, loop: true, paused: true });
            this.bossAttackTimer = this.time.addEvent({ delay: 1500, callback: this.bossAttack, callbackScope: this, loop: true, paused: true });
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

        let hudText = this.subLevel === 1 ? 'ENEMIES DESTROYED: 0 / 20' :
            this.subLevel === 2 ? 'SYSTEM BREACH: 0/30 | 0/15' :
                'MOTHER-SHIP CORE';
        this.scoreText = this.add.text(width / 2, 80, hudText, { fontSize: '24px', fill: '#00f3ff', fontFamily: 'Courier New' }).setScrollFactor(0).setOrigin(0, 0);
        this.scoreText.setX(width / 2 - this.scoreText.width / 2);

        this.p1HPText = this.add.text(20, height - 20, '', { fontSize: '20px', fill: '#ff00ea', fontFamily: 'Courier New', fontWeight: 'bold' }).setOrigin(0, 1).setScrollFactor(0).setDepth(1000);
        this.p2HPText = this.add.text(width - 20, height - 20, '', { fontSize: '20px', fill: '#00ffff', fontFamily: 'Courier New', fontWeight: 'bold' }).setOrigin(1, 1).setScrollFactor(0).setDepth(1000);

        // Start Prompt
        this.controlsHUD = this.add.container(width / 2, height / 2).setScrollFactor(0).setDepth(1001);
        this.controlsHUD.add(this.add.text(0, 0, "PRESS WASD OR ARROW KEYS TO START", { fontSize: '32px', color: '#00FFFF', fontStyle: 'bold' }).setOrigin(0.5));
        this.input.keyboard.once('keydown', () => { this.tweens.add({ targets: this.controlsHUD, alpha: 0, duration: 800 }); });

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
                this.physics.velocityFromRotation(Math.PI / 2 + a, 400, b.body.velocity);
            });
        } else {
            // Final phase is now purely asteroids and mines (Barrage removed as requested)
        }
    }

    spawnEnemy() {
        if (this.subLevel === 3 && this.boss.hp <= 50) return; // Stop ships in final phases

        // Spawn standard Crashing ship
        if (this.subLevel === 1 || (this.subLevel === 2 && this.crashingSpawned < 30) || (this.subLevel === 3 && this.boss.hp > 50)) {
            let x = Phaser.Math.Between(50, this.scale.width - 50);
            let variant = Math.random() > 0.5 ? 'o' : 'g';
            let en = this.enemies.create(x, -50, `enemy_${variant}_m`).setScale(0.6);
            en.baseKey = `enemy_${variant}`;
            en.lastShot = 0;
            this.crashingSpawned++;

            // Randomly spawn a shooter along with crashing ships in later levels
            if (this.subLevel >= 2 && Math.random() > 0.7) {
                this.spawnShooter();
            }
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
        // Move-to-Start Logic
        if (!this.registry.get(REGISTRY_GAME_RUNNING)) {
            let p1 = this.p1; let p2 = this.p2;
            let keys = [p1.ctrls.W, p1.ctrls.A, p1.ctrls.S, p1.ctrls.D];
            if (globalPlayerCount === 2) keys.push(p2.ctrls.up, p2.ctrls.down, p2.ctrls.left, p2.ctrls.right);

            if (keys.some(k => k && k.isDown)) {
                this.registry.set(REGISTRY_GAME_RUNNING, true);
                const ui = this.scene.get('UIScene');
                if (ui) ui.startTime = Date.now();
                // Resume Timers
                this.spawnTimerAsteroid.paused = false;
                this.spawnTimerEnemy.paused = false;
                if (this.spawnTimerShooter) this.spawnTimerShooter.paused = false;
                if (this.spawnTimerMine) this.spawnTimerMine.paused = false;
                if (this.bossAttackTimer) this.bossAttackTimer.paused = false;
            } else {
                return;
            }
        }

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

        if (bullet) bullet.destroy();
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

        if (bullet) bullet.destroy();
        shooter.destroy();
        this.shootersDestroyed++;
        this.updateHUD();
    }

    detonateMine(bullet, mine) {
        if (bullet) bullet.destroy();
        let exp = this.add.sprite(mine.x, mine.y, 'explosion_3_01').setScale(3.0);
        exp.play('boom_3');
        exp.on('animationcomplete', () => exp.destroy());

        // Clear nearby enemies (Increased radius to 400)
        [this.enemies, this.shooterEnemies].forEach(g => {
            g.getChildren().forEach(e => {
                if (Phaser.Math.Distance.Between(e.x, e.y, mine.x, mine.y) < 400) {
                    this.hitEnemy(null, e);
                }
            });
        });

        if (this.boss && Phaser.Math.Distance.Between(this.boss.x, this.boss.y, mine.x, mine.y) < 450) {
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
        const { width } = this.scale;
        if (this.subLevel === 1) {
            this.scoreText.setText(`ENEMIES DESTROYED: ${this.enemiesDestroyed} / 20`);
        } else if (this.subLevel === 2) {
            this.scoreText.setText(`SYSTEM BREACH: ${this.enemiesDestroyed}/30 | ${this.shootersDestroyed}/15`);
        } else if (this.boss) {
            this.bossBar.clear();
            const barW = 300;
            const barH = 15;
            const bx = width / 2 - barW / 2;
            const by = 40;
            // BG
            this.bossBar.fillStyle(0x333333);
            this.bossBar.fillRect(bx, by, barW, barH);
            // Health
            const healthPct = Math.max(0, this.boss.hp / 100);
            this.bossBar.fillStyle(0xff3939);
            this.bossBar.fillRect(bx, by, barW * healthPct, barH);
            // Border
            this.bossBar.lineStyle(2, 0xffffff);
            this.bossBar.strokeRect(bx, by, barW, barH);
        }

        const p1Bars = '❤'.repeat(Math.max(0, this.p1HP));
        const p2Bars = '❤'.repeat(Math.max(0, this.p2HP));
        this.p1HPText.setText(`P1 LIVES: ${p1Bars}`);
        if (globalPlayerCount === 2) {
            this.p2HPText.setText(`P2 LIVES: ${p2Bars}`);
        }
    }

    handleDeath(player, hazard) {
        if (player.invulnerable) return;

        if (player === this.p1) this.p1HP--;
        else this.p2HP--;

        this.updateHUD();
        if (hazard && hazard.destroy) hazard.destroy();

        // Asteroids do a lot less damage to the "mothership" (player)
        // If it's an asteroid, just take 1 life. Don't trigger full death unless HP is already low.
        const isAsteroid = (hazard && hazard.texture && hazard.texture.key === 'asteroid');
        const deathThreshold = isAsteroid ? 0 : 0; // Keeping logic consistent for now, but life check below handles it

        if (this.p1HP <= 0 || (this.p2.active && this.p2HP <= 0)) {
            const victim = this.p1HP <= 0 ? "PLAYER 1" : "PLAYER 2";
            const msg = this.add.text(this.scale.width / 2, this.scale.height / 2, `${victim} HAS DIED!\nRESTARTING SYSTEM...`, {
                fontSize: '40px', fill: '#ff0000', fontFamily: 'Courier New', align: 'center', fontWeight: 'bold'
            }).setOrigin(0.5).setDepth(100).setShadow(0, 0, '#ff0000', 10);

            this.physics.pause();
            this.time.delayedCall(2000, () => {
                msg.destroy();
                this.p1HP = this.maxLives;
                this.p2HP = this.p2.active ? this.maxLives : 0;
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
                    p.alpha = 1;
                });
                this.physics.resume();
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

// ------ LEVEL 5: WIN SCREEN ------
class WinScene extends Phaser.Scene {
    constructor() { super('WinScene'); }
    create() {
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor('#000000');
        // Disable all game events/input
        this.input.enabled = false;
        this.input.keyboard.enabled = false;

        // Visual is handled by UIScene's showWinUI overlay for consistency
        const ui = this.scene.get('UIScene');
        if (ui) ui.showWinUI();
    }
}

// ------ END OF GAME ------
const config = {
    type: Phaser.AUTO, parent: 'game-container', width: '100%', height: '100%',
    backgroundColor: '#0a0a0c', physics: { default: 'arcade', arcade: { debug: false } },
    scene: [BootScene, MenuScene, UIScene, LevelDevilScene, DataFragmentScene, DriftRacingScene, SpaceShooterScene, WinScene],
    scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH }
};

const game = new Phaser.Game(config);
