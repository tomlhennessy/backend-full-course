import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

// Register a new user endpoing /auth/register
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        console.log('Registering username:', username);

        // Debug the query execution
        const getUser = db.prepare(`SELECT * FROM users WHERE username = ?`);
        console.log(`Executing query: SELECT * FROM users WHERE username = '${username}'`);
        const users = getUser.all(username); // Fetch all matching results
        console.log('Queried users array:', users);

        // Check if user exists
        const user = users.length > 0 ? users[0] : undefined;
        console.log('Single user object:', user);
        if (user) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = bcrypt.hashSync(password, 8);

        // Insert the new user
        const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`);
        const result = insertUser.run(username, hashedPassword);
        console.log('Inserted user result:', result);

        // Add a default todo for the new user
        const defaultTodo = `Hello :) Add your first todo!`;
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`);
        insertTodo.run(result.lastInsertRowid, defaultTodo);

        // Generate a token and respond
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(503).json({ message: 'Service Unavailable: ' + err.message });
        }
    });



router.post('/login', (req, res) => {
    // we get their email, and we look up the password associated with that email in the database
    // but we get it back and see it's encrypted, which means that we cannot compare it to the one the user just used trying to login
    // so what we can to do, is again, one way encrypt the password the user just entered

    const { username, password } = req.body

    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
        const user = getUser.all(username)
        console.log('Queried user array:', user);

        // if we cannot find a user associated with that username, return out from the function
        if (!user) { return res.status(404).send({ message: "User not found" }) }

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        // if the password does not match, return out of the function
        if (!passwordIsValid) { return res.status(401).send({ message: "Invalid password" }) }
        console.log(user)

        // then we have a successful authentication
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503).json({message: 'Service Unavailable: ' + err.message })
        }

    })


export default router
