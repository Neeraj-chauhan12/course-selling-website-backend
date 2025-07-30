const user=require("../models/userModel")
const Purchase = require('../models/purchaseModel')
const Course= require("../models/courseModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const cookie =require("cookie-parser")
const z =require('zod')

exports.register=async(req,res)=>{
   const {username,email,password}=req.body;

   const userSchema = z.object({
      username: z.string().min(2,{message:"username must be atleast 6 char long"}),
      email: z.string().email(),
      password: z.string().min(8,{message:"password must be arleast 8 char long"})
    });

    const validData=userSchema.safeParse(req.body)
    if(!validData.success){
      return res.status(400).json({error: validData.error.issues.map((err)=>err.message)})
    }

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
        expiresIn:"1d"
      })

      //for the safety
      const cookieOption={
        httpOnly:true,
        sameSite:"Strict"
      }

      res.cookie("token",token,cookieOption)
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


exports.purchaseControllers=async(req,res)=>{

  const userId=req.userId;

  try {

    const purchased=await Purchase.find({userId})

    let purchasedCourseId=[];

    for(let i=0; i<purchased.length; i++){
      purchasedCourseId.push(purchased[i].courseId)
    }

    const courseData=await Course.find({
      _id:{$in:purchasedCourseId}
    })

    res.status(201).json({purchased,courseData})
    
  } catch (error) {
    console.log(error)
    res.status(500).json({error:"error in purchse server"})
    
  }
}