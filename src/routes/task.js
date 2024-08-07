import express from 'express'

import Task from '../models/task.js'

const routes = express.Router()

routes.post('/', async (req, res) => {
    const task = new Task(req.body)
    try{
        const result = await task.save()
        res.status(201).send(result)

    } catch(err) { res.status(400).send(`error! ${err.message}`)}
})

routes.get('/', async (req, res) => {
    try{
        const tasks = await Task.find()
        res.status(200).send(tasks)
    } catch(err) {
        res.status(500).send(err)
    }
    
})

routes.get('/:id', async(req, res) => {
    try{
        const task = await Task.findById(req.params.id)
        if(!task) 
            return res.status(404).send("Task does not exist")
        res.status(200).send(task)
            
    } catch(err) {
        res.status(400).send(err)
    } 
})

routes.patch('/:id',async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["description", "completed"]
    const isValidUpdates = updates.every(update => allowedUpdates.includes(update))

    if(!isValidUpdates) return res.status(400).send("Error: Invalid update")
    try{
        const task = await Task.findById(req.params.id)
        if(!task) return res.status(404).send('Task not found')
            
        Object.assign(task, req.body);
        await task.save()

        res.status(200).send(task)
    } catch(err) {
        res.status(400).send(err)
    }
})

routes.delete('/:id', async (req, res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)

        if(!task) {
            res.status(400).send("Task does not exist!")
        }

        res.status(200).send(`Task Deleted Successfully`)
    } catch(err) {
        res.status(500).send(err)
    }
})

export default routes;