import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import authRoutes from './routes/auth.routes'
import db from './models'
import dbConfig from './config/db.config'
const Role = db.role

if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

function initial() {
  Role.estimatedDocumentCount((err: any, count: number) => {
    if (!err && count === 0) {
      new Role({
        name: 'user',
      }).save((err: Error) => {
        if (err) {
          console.log('error', err)
        }
        console.log("added 'user' to roles collection")
      })
      new Role({
        name: 'moderator',
      }).save((err: Error) => {
        if (err) {
          console.log('error', err)
        }
        console.log("added 'moderator' to roles collection")
      })
      new Role({
        name: 'admin',
      }).save((err: Error) => {
        if (err) {
          console.log('error', err)
        }
        console.log("added 'admin' to roles collection")
      })
    }
  })
}

db.mongoose
  .connect(
    `mongodb+srv://${dbConfig.DB_USER}:${dbConfig.DB_PASSWORD}@cluster0.phykcn1.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Successfully connect to MongoDB.')
    initial()
  })
  .catch((err) => {
    console.error('Connection error', err)
    process.exit()
  })

const app = express()
const corsOption = {
  origin: 'http://localhost:8000',
}

app.use(cors(corsOption))

// parse requests of content-type: application/json
app.use(express.json())

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept'
  )
  next()
})

// routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to token based auth' })
})
app.use('/api/auth', authRoutes)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
