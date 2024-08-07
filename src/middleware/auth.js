import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const auth = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '')

        const decoded = jwt.verify(token, 'somesuperhardstringtoguess')

        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        req.user = user
        req.token = token

        if(!user) throw new Error()
            
        next()
    }catch(err) {
        res.status(401).send({
            error: "Please authenticate."
        })
    }
}

export default auth