import express from 'express'
import auth from '../middleware/auth.js'
import Task from '../models/task.js'

const routes = express.Router()

routes.post('/', auth, async (req, res) => {
    const task = new Task({...req.body, owner: req.user._id})
    try{
        const result = await task.save()
        res.status(201).send(result)

    } catch(err) { res.status(400).send(`error! ${err.message}`)}
})

routes.get('/', auth, async (req, res) => {
    try{
        const match = {}
        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }

        const tasks = await Task.find(match)
        .limit(req.query.limit)
        .skip(req.query.skip)
        .sort({createdAt: req.query.sortBy})

        res.status(200).send(tasks)
    } catch(err) {
        res.status(500).send(err)
    }
    
})

routes.get('/:id', auth, async(req, res) => {
    try{
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(!task) 
            return res.status(404).send("Task does not exist")
        res.status(200).send(task)
            
    } catch(err) {
        res.status(400).send(err)
    } 
})

routes.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]
    const isValidUpdates = updates.every(update => allowedUpdates.includes(update))

    if(!isValidUpdates) return res.status(400).send("Error: Invalid update")
    try{
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})
        if(!task) return res.status(404).send('Task not found')
            
        Object.assign(task, req.body);
        await task.save()

        res.status(200).send(task)
    } catch(err) {
        res.status(400).send(err)
    }
})

routes.delete('/:id', auth, async (req, res) => {
    try{
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})

        if(!task) {
            res.status(400).send("Task does not exist!")
        }

        res.status(200).send(`Task Deleted Successfully`)
    } catch(err) {
        res.status(500).send(err)
    }
})

export default routes;