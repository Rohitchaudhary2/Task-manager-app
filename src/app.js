import express from 'express'
import connectDb from './db/mongoose.js'
import userRoute from './routes/user.js'
import taskRoute from './routes/task.js'
import 'dotenv/config'

const app = express()
connectDb()
app.use(express.json())

app.use('/users', userRoute)

app.use('/tasks', taskRoute)

export default app

