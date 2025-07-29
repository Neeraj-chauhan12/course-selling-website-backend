const Course=require("../models/courseModel.js")
const cloudinary = require("cloudinary")

exports.Create= async(req,res)=>{
    const {title,description,amount}=req.body;

    try {
    
    if(!title || !description || !amount){
       return res.status(400).json({error:"all field are required"})
    }


    //uploaded file
    const {image}=req.files
    if(!req.files || Object.keys(req.files).length===0){
        return res.status(400).json({errors:"no file uploaded"})
    }

    //file types

    const allowedFormat=["image/png","image/jpeg"]
    if(!allowedFormat.includes(image.mimetype)){
        return res.status(400).json({error:"invalid file format . only png and jpeg  are allowed"})
    }

    //cloudinary code

    const cloud_response=await cloudinary.uploader.upload(image.tempFilePath)
    if(!cloud_response || cloud_response.error){
        return res.status(400).json({errors:"error uploading file to cloudinary"})
    }

     const courseData={
            title,
            description,
            amount,
            image:{
                public_id:cloud_response.public_id,
                url:cloud_response.url
            }
        }
        const course= await Course.create(courseData)
         res.status(201).json({message:"course is create successfully",course})
    
} catch (error) {
    console.log(error)
    res.status(500).json({error:"error in create course server"})
    
}




}