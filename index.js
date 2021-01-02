const express = require('express')
const app = express()
const mongoose  = require('mongoose')

const PORT = 5000
const {dbUrl} = require('./important')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')
const userRouter = require('./routes/user')


mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected',()=>{
    console.log("conneted to db")
})
mongoose.connection.on('error',(err)=>{
    console.log("err connecting",err)
})

app.use(express.json())
app.use(authRouter)
app.use(postRouter)
app.use(userRouter)

app.listen(PORT,()=>{
    console.log("server is running on",PORT)
})
