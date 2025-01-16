import express from 'express'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 3000

// get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url);
// get the directory name from the file path
const __dirname = path.dirname(__filename);


// Middleware
app.use(express.json())
// serves the HTML file from the public directory
// tells express to serve all files from the public folder as static assets / files. Any requests for the CSS files will be resolved to the public directory.
app.use(express.static(path.join(__dirname, '../public')))




app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`)
})
