import app from './app.js'


const PORT = process.env.PORT 


app.listen(3000, () => {
    console.log(`Server is running on PORT ${PORT}` )
})

