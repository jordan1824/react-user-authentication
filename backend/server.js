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

// Routes
app.use('/', require('./routers/userRouter'))

// Server Listener
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
