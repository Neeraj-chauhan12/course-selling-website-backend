const admin=require("../models/adminModel")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const cookie =require("cookie-parser")
const z=require('zod')

exports.register=async(req,res)=>{
   const {adminname,email,password}=req.body;

   const adminSchema = z.object({
         adminname: z.string().min(2,{message:"username must be atleast 6 char long"}),
         email: z.string().email(),
         password: z.string().min(8,{message:"password must be arleast 8 char long"})
       });
   
       const validData=adminSchema.safeParse(req.body)
       if(!validData.success){
         return res.status(400).json({error: validData.error.issues.map((err)=>err.message)})
       }

   try {
     const adminExist=await admin.findOne({email})
   if(adminExist){
    return res.status(400).json({error:"admin already exists"});

   }

  const hassPassword=await bcrypt.hash(password, 10);

  const newAdmin=new admin({
    adminname,
    email,
    password:hassPassword,
  })

  await newAdmin.save();

  res.status(201).json({message:"admin register successful",newUser:{
    adminname:newAdmin.adminname,
    email:newAdmin.email,
    password:newAdmin.password
  }})
    
   } catch (error) {
    
    res.status(500).json({error:"server error"})
    
   }
   

}


exports.loginControllers=async(req,res)=>{

  const {email,password}=req.body;

  try {

    const Admin=await admin.findOne({email})
    if(!Admin){
      return res.status(400).json({error:"invalid credential"})
    }

    //password match
    const isMatch=await bcrypt.compare(password, Admin.password) 

    if(!isMatch){
     return res.status(400).json({error:"password is not match"})
    }
  

    const token=jwt.sign({id:Admin._id},
      process.env.ADMIN_JWT_SECRET,{
        expiresIn:"1h"
      })

      res.cookie("token",token)
      res.status(201).json({message:"login successfully",
        email:Admin.email,
        password:Admin.password
      })

  

  } catch (error) {
    res.status(500).json({error:"error in login server"})
    
  }
}


exports.logoutControllers=async(req,res)=>{
  try {
    res.clearCookie("token")
  res.status(201).json({message:"logout successfully"})
    
  } catch (error) {
    console.log(error)
    res.status.json({error:"error in logout server"})
    
  }
  
  
}