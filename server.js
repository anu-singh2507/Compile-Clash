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
    1: { level: "Normal", text: "Write a console.log statement that outputs 'Hello World'.", expected: "Hello World" },
    2: { level: "Medium", text: "Write a function that calculates 5 + 5 and logs '10'.", expected: "10" }
};
for (let i = 3; i <= 50; i++) {
    questions[i] = { level: "Varied", text: `Dummy System Override Question for Sequence ${i}. Type "skip" to pass.`, expected: "skip" };
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
    const teamId = req.params.id;
    db.get(`SELECT current_level, current_sublevel, player_count FROM teams WHERE id = ?`, [teamId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Team not found' });
        const question = questions[row.current_level] || questions[50];
        res.json({ current_level: row.current_level, current_sublevel: row.current_sublevel, player_count: row.player_count, question_text: question.text, level_difficulty: question.level });
    });
});

// Validate code submission
app.post('/api/teams/:id/submit', (req, res) => {
    const teamId = req.params.id;
    const { submission } = req.body;
    if (!submission) return res.status(400).json({ error: 'submission code is required' });

    db.get(`SELECT current_level FROM teams WHERE id = ?`, [teamId], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Team not found' });

        const question = questions[row.current_level] || questions[50];
        const isValid = submission.includes(question.expected);
        if (isValid) res.json({ success: true, message: 'Correct submission!' });
        else res.json({ success: false, message: 'Incorrect submission. Try again.' });
    });
});

// Update team progress
app.post('/api/teams/:id/progress', (req, res) => {
    const teamId = req.params.id;
    const { score_increment, new_level, new_sublevel, duration_seconds } = req.body;

    const sql = `UPDATE teams 
                 SET current_level = COALESCE(?, current_level), current_sublevel = COALESCE(?, current_sublevel),
                     total_score = total_score + ?, active_time_seconds = active_time_seconds + ?
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
    console.log(`COMPILE CLASH Back-End Server running on http://localhost:${PORT}`);
});
