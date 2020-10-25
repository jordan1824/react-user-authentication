const { Pool } = require('pg')
require('dotenv').config()

const db = new Pool({
  user: 'postgres',
  password: process.env.DATABASE_PASSWORD,
  database: 'user_authentication',
  host: 'localhost',
  port: 5432
})

module.exports = db
