import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';
import 'dotenv/config'
import authRoutes from './routes/authRoutes.js'
import todoRoutes from './routes/todoRoutes.js'

const app = express()
const PORT = process.env.PORT || 3000

// get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url);
// get the directory name from the file path
const __dirname = path.dirname(__filename);


// Middleware
app.use(express.json())

// tells express to serve all files from the public folder as static assets / files. Any requests for the CSS files will be resolved to the public directory.
app.use(express.static(path.join(__dirname, '../public')))


// serves the HTML file from the public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Routes
app.use('/auth', authRoutes)
app.use('/todos', todoRoutes)

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})
