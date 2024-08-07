import express from 'express'

import User from '../models/user.js'

const routes = express.Router()

routes.post('/', async (req, res) => {
        const user = new User(req.body)
        try{
            const result = await user.save()
            res.status(201).send(result)
    
        } catch(err) { res.status(400).send(`error! ${err.message}`)}
    })

routes.post('/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        res.status(200).send("Login successfully")
    }catch(err) {
        res.status(404).send(err.message)
    }

})
    
routes.get('/', async (req, res) => {
    try{
        const users = await User.find()
        res.status(200).send(users)
    } catch(err) {
        res.status(500).send(err)
    }
    
})

routes.get('/:id', async(req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user) 
            return res.status(404).send("User does not exist")
        res.status(200).send(user)
            
    } catch(err) {
        res.status(400).send(err)
    } 
})

routes.patch('/:id',async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "age"]
    const isValidUpdates = updates.every(update => allowedUpdates.includes(update))

    if(!isValidUpdates) return res.status(400).send("Error: Invalid update")
    try{

        const user = await User.findById(req.params.id)
        
        if(!user) return res.status(404).send('User not found')

        Object.assign(user, req.body)

        await user.save()

        res.status(200).send(user)
    } catch(err) {
        res.status(400).send(err)
    }
})

routes.delete('/:id', async (req, res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user) {
            return res.status(400).send("User does not exist!")
        }

        res.status(200).send(`Deleted Successfully ${user}`)
    } catch(err) {
        res.status(500).send(err)
    }
})

export default routes;