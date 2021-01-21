require('dotenv').config();

const { PORT, NODE_ENV, JWT_SECRET, MONGO_DB_URL } = process.env

const isProd = NODE_ENV === 'production'

const saltRound = (isProd && SALT_ROUND) ? SALT_ROUND : 10
const jwtSecret = (isProd && JWT_SECRET) ? JWT_SECRET : 'very_secret_key'
const mongoDbUrl = (isProd && MONGO_DB_URL) ? MONGO_DB_URL : 'mongodb://localhost:27017/newsdb'
const port = (isProd && PORT) ? PORT : '3000'




module.exports = {
  SALT_ROUND: saltRound,
  JWT_SECRET: jwtSecret,
  MONGO_DB_URL: mongoDbUrl,
  PORT: port,
};