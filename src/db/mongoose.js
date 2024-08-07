import mongoose from 'mongoose'

function connectDb() {
    mongoose.connect('mongodb://127.0.0.1:27017/task-manager')

}

export default connectDb

// const me = new User({
//     name: '    Ritik Chaudhary ',
//     email: 'Ritik@gmail.com',
//     password: 'sjhasgjh',
//     age: 20
// })

// me.save().then(() => {
//     console.log(me)
// }).catch(err => console.log("Error", err))


// const task = new Task({
//     description: '  Code  ',
//     completed: true
// })

// task.save().then(() => {
//     console.log(task)
// }) .catch(err => console.log("Error!", err))

