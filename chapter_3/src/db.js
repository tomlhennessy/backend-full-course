import Database from 'better-sqlite3'
const db = new Database(':memory:')

// execute SQL statements from strings
db.exec(`
    CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )
`)
db.exec(`
    CREATE TABLE todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        task TEXT,
        completed BOOLEAN DEFAULT 0,
        FOREIGN KEY(user_id) REFERENCES users(id)
    )
`)

export default db
