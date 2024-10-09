import 'express-async-errors'
// express async errors package handles any async errors and passes them to our middleware
import * as dotenv from 'dotenv'
dotenv.config()
// console.log(Error)

import express from 'express'
const app = express()
import morgan from 'morgan'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

// ROUTERS
import jobRouter from './routes/jobRouter.js'
import authRouter from './routes/authRouter.js'
import userRouter from './routes/userRouter.js'

// MIDDLEWARE
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js'
import { authenticateUser } from './middleware/authMiddleware.js'

// PUBLIC
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import path from 'path'

import cloudinary from 'cloudinary'

// if not production
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// logging tool
app.use(morgan('dev'))
// __dirname points to the current folder
// we have no access to __ dirname so we make a variable
// this is due to deployment as it lookes for __dirname
//lock down all routes under this route
// ES6 MODULES SYNTAX
// with common js we do not need to do this
// static is built in express middleware

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

// make our public folder publicly avalible
const __dirname = dirname(fileURLToPath(import.meta.url))
app.use(express.static(path.resolve(__dirname, './public')))

app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' })
})

app.use('/api/v1/jobs', authenticateUser, jobRouter)
app.use('/api/v1/users', authenticateUser, userRouter)
app.use('/api/v1/auth', authRouter)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public.html', 'index.html'))
})

// ********* difference between not found vs error route **********
// THIS IS LIKE A CATCH ALl
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found' })
})

// ERR MIDDLEWARE GETS TRIGGRED IF THE ROUTE IS AVALABLE
// NOT FOUND GETS TRIGGERED IF THE RESCOURCE IS NOT AVALABLE ON THE SERVER

app.use(errorHandlerMiddleware) // could have written err signature here

const port = process.env.PORT || 5100
// if successful then start the server
try {
  await mongoose.connect(process.env.MONGO_URL)
  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`)
  })
} catch (error) {
  console.log(error)
  process.exit(1)
}
