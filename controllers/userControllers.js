const user=require("../models/userModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

exports.register=async(req,res)=>{
   const {username,email,password}=req.body;

   try {
     const userExist=await user.findOne({email})
   if(userExist){
    return res.status(400).json({error:"user already exists"});

   }

  const hassPassword=await bcrypt.hash(password, 10);

  const newUser=new user({
    username,
    email,
    password:hassPassword,
  })

  await newUser.save();

  res.status(201).json({message:"user register successful",newUser:{
    username:newUser.username,
    email:newUser.email,
    password:newUser.password
  }})
    
   } catch (error) {
    
    res.status(500).json({error:"server error"})
    
   }
   
  
   

}