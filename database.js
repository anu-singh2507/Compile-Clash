const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'compile_clash.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database ', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS teams (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            team_name TEXT UNIQUE,
            current_level INTEGER DEFAULT 1,
            current_sublevel INTEGER DEFAULT 1,
            start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            total_score INTEGER DEFAULT 0,
            active_time_seconds INTEGER DEFAULT 0,
            player_count INTEGER DEFAULT 1
        )`, (err) => {
            if (err) console.error("Error creating teams table", err.message);
            // Attempt to alter table if the column doesn't exist yet for existing dbs
            db.run(`ALTER TABLE teams ADD COLUMN active_time_seconds INTEGER DEFAULT 0`, () => {});
            db.run(`ALTER TABLE teams ADD COLUMN player_count INTEGER DEFAULT 1`, () => {});
        });

        db.run(`CREATE TABLE IF NOT EXISTS team_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT UNIQUE,
            team_id INTEGER
        )`, (err) => {
            if (err) console.error("Error creating team_codes table", err.message);
        });

        db.run(`CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )`, (err) => {
            if (err) return;
            // Initialize game_started if not exists
            db.run(`INSERT OR IGNORE INTO settings (key, value) VALUES ('game_started', 'false')`);
        });
    }
});

module.exports = db;
