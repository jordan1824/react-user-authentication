const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../db')
require('dotenv').config()

// Router-specific Middleware

const jwtVerification = async (req, res, next) => {
  try {
    const { token } = req.body
    const { id } = jwt.verify(token, process.env.JWTSECRET)
    req.userId = id
    next()
  } catch (err) {
    return res.status(403).json('Token was not verified')
  }
}

const validateRegistration = (req, res, next) => {
  const { username, email, password } = req.body
  if (!username || !email || !password) {
    return res.status(401).json('One or more fields are blank.')
  }
  next()
}

// Routes

router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { username, email, password } = req.body
    // Check if username is already taken
    const usernameResult = await db.query('SELECT * FROM users WHERE username = $1', [username])
    if (usernameResult.rows.length > 0) {
      return res.status(401).json('That username is already taken.')
    }
    // Check if email is already taken
    const emailResult = await db.query('SELECT * FROM users WHERE email = $1', [email])
    if (emailResult.rows.length > 0) {
      return res.status(401).json('That email is already taken.')
    }
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    // Add user to database
    const response = await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING username', [username, email, hashedPassword])
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
      return res.status(401).json('Incorrect username and/or password.')
    }
    // Stores password of the user with the speicifed username
    const hashedPassword = response.rows[0].password
    // Checks to see if the password provided matches hashed password in db
    const result = await bcrypt.compare(password, hashedPassword)
    if (!result) {
      return res.status(401).json('Incorrect username and/or password.')
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

module.exports = router
