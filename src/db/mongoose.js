import mongoose from 'mongoose'

function connectDb() {
    mongoose.connect(process.env.MONGO_URL)

}

export default connectDb
