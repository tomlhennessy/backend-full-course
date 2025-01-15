const express = require('express')
const app = express()
const PORT = 3000

let data = ['tom']

// middleware
app.use(express.json())


// HTTP Paths
// the method informs the nature of the request and the route is a further subdirectory
// we direct the request to the body of code to respon appropriately, and these locations are called endpoints

// website endpoints

app.get('/', (req, res) => {
    res.send(`
        <body style="background: pink; color: blue;">
            <h1>DATA:</h1>
            <p>${JSON.stringify(data)}</p>
            <a href="/dashboard">Dashboard</a>
        </body>
        `)
})

app.get('/dashboard', (req, res) => {
    res.send(`
        <body>
            <h1>Dashboard</h1>
            <a href="/">Home</a>
        </body>
        `)
})


// API endpoints (non visual)

app.get('/api/data', (req, res) => {
    res.send(data)
})

app.post('/api/data', (req, res) => {
    const newEntry = req.body
    console.log('New entry.')
    data.push(newEntry.name)
    res.sendStatus(201)
})

app.delete('/api/data', (req, res) => {
    data.pop()
    console.log('We deleted the element off the end of the array')
    res.sendStatus(203)
})



app.listen(PORT, () => console.log(`Server has started on: ${PORT}`))
