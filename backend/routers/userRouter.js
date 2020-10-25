const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../db')
require('dotenv').config()

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    // Add user to database
    const response = await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, hashedPassword])
    const data = response.rows[0]
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    res.status(500).json('There has been an error. Please try again later.')
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    // Checks if username exists in database
    const response = await db.query('SELECT * FROM users WHERE username = $1', [username])
    if (!response.rows[0]) {
      return res.status(401).json('Username or password was incorrect.')
    }
    // Stores password of the user with the speicifed username
    const hashedPassword = response.rows[0].password
    // Checks to see if the password provided matches hashed password in db
    const result = await bcrypt.compare(password, hashedPassword)
    if (!result) {
      return res.status(401).json('Username or password was incorrect.')
    }
    // User is verified, generate token
    const userInfo = response.rows[0]
    const token = jwt.sign({ id: userInfo.id }, process.env.JWTSECRET, { expiresIn: '30d' })
    // Send back users information
    const data = {
      id: userInfo.id,
      username: userInfo.username,
      email: userInfo.email,
      token: token
    }
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    res.status(500).json('There has been an error. Please try again later.')
  }
})

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body
    const { id } = jwt.verify(token, process.env.JWTSECRET)
    req.userId = id
    console.log(req.userId)
    res.status(200).json(id)
  } catch (err) {
    return res.status(403).json('Token was not verified')
  }
})

module.exports = router
