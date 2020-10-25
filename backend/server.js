const express = require('express')
const cors = require('cors')
require('dotenv').config()

// Creates instance of server
const app = express()

// Environmental variables
const PORT = process.env.PORT

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routers
app.use('/', require('./routers/Router'))

// Server Listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
