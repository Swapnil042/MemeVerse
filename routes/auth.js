const express = require('express')
const router = express.Router()
const User = require('../models/user');

const {jwt_secret} = require('../important')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.post('/signup',async(req,res)=>{
    const {name,email,password} = req.body 
    if(!email || !password || !name){
       return res.status(422).json({error:"please add all the fields"})
    }
    try{
        const user = await User.findOne({email:email})
        if(user){
            return res.status(422).json({error:"user already exists with that email"})
        }
        const hashedPass = await bcrypt.hash(password,8)
            
        const newUser = new User({
                    email,
                    password:hashedPass,
                    name,
                })
        await newUser.save()
        res.json({message:"saved successfully"})
    }catch(e){
        res.status(400).send(e)
        console.log(e);
    }
}) 

router.post('/signin',async (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"please add email or password"})
    }
    try{
        const user = await User.findOne({email:email})
        if(!user){
            return res.status(422).json({error:"Invalid Email or password"})
        }
        const doMatch = await bcrypt.compare(password,user.password)
        if(doMatch){
            const token = jwt.sign({_id:user._id},jwt_secret)
            const {_id,name,email,followers,following,pic} = user
            res.json({token,user:{_id,name,email,followers,following,pic}})
        }
        else{
            return res.status(422).json({error:"Invalid Email or password"})
        }
    }catch(e){
        res.status(400).send(e)
        console.log(e);
    }
})
    
   
module.exports = router