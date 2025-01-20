import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(':memory:'); // In-memory SQLite database

// Create tables using SQL statements
db.serialize(() => {
    db.run(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )
    `);

    db.run(`
        CREATE TABLE todos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            task TEXT,
            completed BOOLEAN DEFAULT 0,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    `);
});

db.serialize(() => {
    db.all('PRAGMA table_info(users);', (err, rows) => {
        if (err) {
            console.error('Error running PRAGMA table_info(users):', err.message);
        } else {
            console.log('Schema for users table:', rows);
        }
    });
});

db.all('SELECT * FROM users;', (err, rows) => {
    if (err) {
        console.error('Error fetching users:', err.message);
    } else {
        console.log('Users in database:', rows);
    }
});



export default db;
