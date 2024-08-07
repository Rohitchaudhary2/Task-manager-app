import bcrypt from "bcryptjs"
import mongoose from "mongoose"
import validator from 'validator'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if(value.toLowerCase().includes('password')){
                throw new Error('Password should not contain password string.')
            }
        }
    },
    age: {
        type: Number,
        required: true,
        validate(value) {
            if(value<0) {
                throw new Error('Age must be a positive number.')
            }
        }
    }
})

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({email});
    if(!user) throw new Error("Unable to login")

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) throw new Error('Unable to login')

    return user
}

userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next()
})

const User = mongoose.model('User', userSchema)

export default User