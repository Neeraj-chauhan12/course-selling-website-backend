const user=require("../models/userModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const cookie =require("cookie-parser")

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


exports.loginControllers=async(req,res)=>{

  const {email,password}=req.body;

  try {

    const User=await user.findOne({email})
    if(!User){
      return res.status(400).json({error:"invalid credential"})
    }

    //password match
    const isMatch=await bcrypt.compare(password, User.password) 

    if(!isMatch){
     return res.status(400).json({error:"password is not match"})
    }
  

    const token=jwt.sign({id:User._id},
      process.env.JWT_ACCESS_SECRET,{
        expiresIn:"1h"
      })

      res.cookie("token",token)
      res.status(201).json({message:"login successfully",
        email:User.email,
        password:User.password
      })

  

  } catch (error) {
    res.status(500).json({error:"error in login server"})
    
  }
}


exports.logoutControllers=async(req,res)=>{
  res.clearCookie("token")
  res.status(201).json({message:"logout successfully"})
}