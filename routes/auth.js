// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const db = new sqlite3.Database('mahillm.db');

// Ensure the users table exists
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    `);
});

// Signup route
router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,[username, email, hashedPassword],
            function (err) {
                if (err) {
                    console.error(err.message);
                    return res.status(500).send('Error registering user');
                }
                console.log(`A row has been inserted with rowid ${this.lastID}`);
                res.status(200).send('User registered successfully');
            }
        );
    } catch (error) {
        console.error(error);
        res.status(500).send('Error hashing password');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, row) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send('Error during login');
        }
        if (!row) {
            return res.status(400).send('Invalid credentials');
        }

        try {
            const passwordMatch = await bcrypt.compare(password, row.password);
            if (passwordMatch) {
                res.status(200).send('Login successful');
            } else {
                res.status(400).send('Invalid credentials');
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Error comparing passwords');
        }
    });
});

module.exports = router;