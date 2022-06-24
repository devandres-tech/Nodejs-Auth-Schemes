import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import db from './models'
import dbConfig from './config/db.config'
const Role = db.role

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

// db.mongoose.connect(``)

const app = express()
const corsOption = {
  origin: 'http://localhost:8000',
}

app.use(cors(corsOption))

// parse requests of content-type: application/json
app.use(express.json())

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to token based auth' })
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
