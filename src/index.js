import express from 'express'
import connectDb from './db/mongoose.js'
import Task from './models/task.js'
import userRoute from './routes/user.js'
import taskRoute from './routes/task.js'


const app = express()
connectDb()
app.use(express.json())

const PORT = process.env.PORT || 3000

app.use('/users', userRoute)

app.use('/tasks', taskRoute)





app.listen(3000, () => {
    console.log(`Server is running on PORT ${PORT}` )
})