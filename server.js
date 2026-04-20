const express = require('express');
const cors = require('cors');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const questions = {
    // Only defining active terminal challenges to avoid placeholder leaks
    "2-2": { 
        level: "Data Fragment", 
        text: `# 🔴 BUG HUNT (Python)\n\n# Fix the 4 errors in the code below:\n\ndef calculate_area(length breadth):\n    area = length X breadth\n    return Area\n\nresult = calculate_area(5, 10\nprint("Area is: " result)`,
        expected: "SPECIAL_PYTHON_VALIDATION_L2S2" 
    },
    // Dynamic sequence placeholders for future levels
    "3-2": { level: "Cyber Drift", text: "System Integrity Check. Type 'verify' to proceed.", expected: "verify" },
    "3-3": { 
        level: "Cyber Drift", 
        text: `## 🟢 Q3 — SPOT THE BUG (HTML)\n\n# Fix the 4 errors in the code below:\n\n<!DOCTYPE html>\n<html>\n<head>\n    <title>Student Profile</title>\n</head>\n<body>\n\n    <h1>Student Profile<h1>\n\n    <p>Name: <b>Alex Johnson</b></p>\n    <p>Course: <i>Computer Science<i></p>\n    <br>\n\n    <p>Visit us: <a href="www.college.edu">College Website</p>\n\n    <hr>\n\n    <table border="1">\n        <tr>\n            <th>Subject</th>\n            <th>Marks</th>\n        </tr>\n        <tr>\n            <td>Python</td>\n            <td>88<th>\n        </tr>\n    </table>\n\n</body>\n</html>`, 
        expected: "SPECIAL_HTML_VALIDATION_L3S3" 
    },
    "4-2": {
        level: "Celestial Defender",
        text: `## 🔵 Q4 — FIND THE OUTPUT (Python)\n\n# What will be the output of the following Python code?\n\nx = 10\ny = 3\n\nprint(x + y)\nprint(x % y)\nprint(x // y)\nprint(x > y)\n\nfruits = ["apple", "banana", "cherry"]\nprint(fruits[1])\nprint(len(fruits))`,
        expected: "SPECIAL_OUTPUT_VALIDATION_L4S2"
    },
    "4-3": {
        level: "Celestial Defender",
        text: `## ⭐ Q5 — STAR PATTERN (Python) — THE MAIN QUESTION\n\n# Write a Python program to print the following TWO patterns using n = 5.\n\n# Pattern 1 (Triangle) and Pattern 2 (Reverse Triangle).\n# Use a LOOP to solve both.`,
        expected: "SPECIAL_CODE_VALIDATION_L4S3"
    }
};
for (let i = 4; i <= 50; i++) {
    questions[`${i}-1`] = { level: "Varied", text: `Encrypted Layer ${i}. Type "skip" to bypass security.`, expected: "skip" };
}

// Register
app.post('/api/register', (req, res) => {
    const { team_name, player_count } = req.body;
    db.run(`INSERT INTO teams (team_name, player_count) VALUES (?, ?)`, [team_name, player_count || 1], function(err) {
        if (err) {
            // IF exists just fetch it 
            db.get(`SELECT id FROM teams WHERE team_name = ?`, [team_name], (err, row) => {
                if (row) res.json({ team_id: row.id, message: "Welcome back." });
                else res.status(500).json({ error: err.message });
            });
        } else {
            res.json({ team_id: this.lastID, message: "Team Registered." });
        }
    });
});

// Fetch current level question
app.get('/api/teams/:id/question', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const teamId = req.params.id;
    db.get(`SELECT current_level, current_sublevel, player_count FROM teams WHERE id = ?`, [teamId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Team not found' });
        
        const qKey = `${row.current_level}-${row.current_sublevel}`;
        console.log(`Team ${teamId} (DB: ${qKey}) requested active challenge.`);
        
        const question = questions[qKey] || { 
            text: `> SYSTEM STALLED: NO OVERRIDE TASK FOR SEQUENCE ${qKey}.\n> CONTACT ADMIN.`, 
            level: "N/A" 
        };
        
        res.json({ 
            current_level: row.current_level, 
            current_sublevel: row.current_sublevel, 
            player_count: row.player_count, 
            question_text: question.text, 
            level_difficulty: question.level 
        });
    });
});

// Validate code submission
app.post('/api/teams/:id/submit', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const teamId = req.params.id;
    const { submission } = req.body;
    if (!submission) return res.status(400).json({ error: 'submission code is required' });

    db.get(`SELECT current_level, current_sublevel FROM teams WHERE id = ?`, [teamId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Team not found' });

        const qKey = `${row.current_level}-${row.current_sublevel}`;
        console.log(`Team ${teamId} submitting for key: ${qKey}. Code: ${submission.substring(0, 50)}...`);
        const question = questions[qKey]; // Look up the question data

        let isValid = false;

        // Global Testing Bypass
        if (submission.trim() === "DEBUG_SKIP") {
            isValid = true;
        } 
        // Special Validation for Level 2 Sublevel 2 (Python Fix)
        else if (qKey === "2-2") {
            const code = submission.replace(/\s+/g, ' '); 
            const hasComma = /calculate_area\s*\(\s*length\s*,\s*breadth\s*\)/.test(code);
            const hasStar = /length\s*\*\s*breadth/.test(code);
            const hasReturn = /return\s+area\b/.test(code); 
            const hasParen = /calculate_area\s*\(\s*5\s*,\s*10\s*\)/.test(code);
            if (hasComma && hasStar && hasReturn && hasParen) isValid = true;
        } else if (qKey === "3-3") {
            const code = submission.replace(/\s+/g, ' ');
            const hasH1 = /<h1>.*?<\/h1\s*>/i.test(code);
            const hasItalic = /<i>.*?<\/i\s*>/i.test(code);
            const hasAnchor = /<a\s+href=.*?<\/a\s*>/i.test(code);
            const hasTableCell = /<td\s*>\s*88\s*<\/td\s*>/i.test(code);
            if (hasH1 && hasItalic && hasAnchor && hasTableCell) isValid = true;
        } else if (qKey === "4-2") {
            const normalizedOutput = submission.trim().replace(/\r\n/g, '\n').replace(/\s+/g, ' ');
            const expectedOutput = "13 1 3 True banana 3";
            if (normalizedOutput === expectedOutput) isValid = true;
        } else if (qKey === "4-3") {
            const code = submission.toLowerCase();
            const hasLoop = code.includes('for ') || code.includes('while ');
            const hasNValue = /n\s*=\s*5/.test(code);
            const rangeCount = (code.match(/range/g) || []).length;
            const hasPrinting = code.includes('print') && code.includes('*');
            
            // Leniency: At least 1 loop, n=5, 2 ranges (for 2 patterns), and star printing
            if (hasLoop && hasNValue && rangeCount >= 2 && hasPrinting) isValid = true;
        } else if (question && question.expected) {
            isValid = submission.includes(question.expected);
        } else {
            isValid = submission.length > 0;
        }

        if (isValid) res.json({ success: true, message: 'Correct submission! REBOOTING SYSTEM...' });
        else res.json({ success: false, message: 'Incorrect submission. Bugs still detected.' });
    });
});

// Game Status (Polling)
app.get('/api/game-status', (req, res) => {
    db.get(`SELECT value FROM settings WHERE key = 'game_started'`, (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ started: row ? row.value === 'true' : false });
    });
});

// Admin: Start Game
app.post('/api/admin/start-game', (req, res) => {
    db.run(`UPDATE settings SET value = 'true' WHERE key = 'game_started'`, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Game Started for all teams." });
    });
});

// Admin: Reset All (Global Start Flag)
app.post('/api/admin/reset-game', (req, res) => {
    db.run(`UPDATE settings SET value = 'false' WHERE key = 'game_started'`, (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Game Reset." });
    });
});

// Admin: Login
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'arishk' && password === 'anu2507') {
        res.json({ success: true, message: "Login Successful" });
    } else {
        res.status(401).json({ success: false, message: "Invalid Credentials" });
    }
});

// Admin: Delete Team
app.delete('/api/admin/teams/:id', (req, res) => {
    const id = req.params.id;
    db.run(`DELETE FROM teams WHERE id = ?`, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Team Deleted." });
    });
});

// Admin: Reset Team Progress
app.post('/api/admin/teams/:id/reset', (req, res) => {
    const id = req.params.id;
    db.run(`UPDATE teams SET current_level = 1, current_sublevel = 1, total_score = 0, active_time_seconds = 0 WHERE id = ?`, [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Team Progress Reset." });
    });
});

// Admin: Update Team Score
app.post('/api/admin/teams/:id/score', (req, res) => {
    const id = req.params.id;
    const { new_score } = req.body;
    db.run(`UPDATE teams SET total_score = ? WHERE id = ?`, [new_score, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: "Score Updated." });
    });
});

// Update team progress
app.post('/api/teams/:id/progress', (req, res) => {
    const teamId = req.params.id;
    const { score_increment, new_level, new_sublevel, duration_seconds } = req.body;

    const sql = `UPDATE teams 
                 SET current_level = COALESCE(?, current_level), current_sublevel = COALESCE(?, current_sublevel),
                     total_score = total_score + ?, active_time_seconds = ?
                 WHERE id = ?`;

    db.run(sql, [new_level, new_sublevel, score_increment || 0, duration_seconds || 0, teamId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Team progress updated successfully.' });
    });
});

// Leaderboard
app.get('/api/leaderboard', (req, res) => {
    const sql = `SELECT * FROM teams ORDER BY current_level DESC, current_sublevel DESC, active_time_seconds ASC`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`FUNSCRIPT Back-End Server running on http://localhost:${PORT}`);
});
