const jwt = require('jsonwebtoken')
const {jwt_secret} = require('../important')
const mongoose = require('mongoose')
const User = mongoose.model("User")

module.exports = (req,res,next)=>{
    const {authorization} = req.headers
    //authorization === Bearer ewefwegwrherhe
    if(!authorization){
       return res.status(401).json({error:"Please authenticate"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token,jwt_secret,(err,payload)=>{
        if(err){
            return   res.status(401).json({error:"Please authenticate"})
        }
        const {_id} = payload
        User.findById(_id)
        .then(userdata=>{
            req.user = userdata
            next()
        }).catch(e=>{
            res.status(401).json({error:"Please authenticate"})
        })
    })
}
        