import dotenv from 'dotenv'
dotenv.config()

export default {
  DB: process.env.DB,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
}
