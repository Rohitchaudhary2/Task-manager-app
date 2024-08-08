import express from 'express'
import auth from '../middleware/auth.js'
import User from '../models/user.js'
import Task from '../models/task.js'

const routes = express.Router()

routes.post('/', async (req, res) => {
        const user = new User(req.body)
        try{
            const token = await user.generateAuthToken() 
            
            res.status(201).send({user, token})
    
        } catch(err) { res.status(400).send(`error! ${err.message}`)}
    })

routes.post('/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken() 

        res.status(200).send({user, token})
    }catch(err) {
        res.status(400).send(err.message)
    }

})

routes.post('/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)

        await req.user.save()

        res.status(200).send(`Logged out successfully`)
    }catch(err) {
        res.status(400).send(err.message)
    }

})

routes.post('/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []

        await req.user.save()

        res.status(200).send(`Logged out successfully`)
    }catch(err) {
        res.status(400).send(err.message)
    }

})
    
routes.get('/me', auth, async (req, res) => {
    res.status(200).send(req.user)
    
})

routes.patch('/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "age"]
    const isValidUpdates = updates.every(update => allowedUpdates.includes(update))

    if(!isValidUpdates) return res.status(400).send("Error: Invalid update")
    try{
        Object.assign(req.user, req.body)

        await req.user.save()

        res.status(200).send(req.user)
    } catch(err) {
        res.status(400).send(err)
    }
})

routes.delete('/me', auth, async (req, res) => {
    try{
        await req.user.deleteOne()

        await Task.deleteMany({owner: req.user._id})
        res.status(200).send(`Deleted Successfully `)
    } catch(err) {
        res.status(500).send(err.message)
    }
})

export default routes;