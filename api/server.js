require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()



app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/app', express.static(path.join(__dirname, '/public')))

let PORT = process.env.PORT || 3000
app.listen(PORT, () => { console.log(`Server running on port ${PORT}`) })

const apiRouter = require('./api/routes/apiRouter.js')

app.use ('/api', apiRouter)
