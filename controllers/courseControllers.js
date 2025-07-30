const Course=require("../models/courseModel.js")
const Purchase=require("../models/purchaseModel.js")
const cloudinary = require("cloudinary")

exports.CreateCourse= async(req,res)=>{
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

exports.UpdateCourse=async(req,res)=>{
    const {courseId}=req.params;
    const {title,description,amount,image}=req.body;

    try {

        const updateCourse=await Course.updateOne(
            {
                _id:courseId,
            },
            {
                title,
                description,
                amount,
                image:{
                    public_id:image?.public_id,
                    url:image?.url
                }
            }
        );

        res.status(201).json({message:"course update successfully"})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error:"the error in update server"})
        
    }
}


exports.DeleteCourse=async(req,res)=>{
    const {courseId}=req.params;

    try {

        const course=await Course.findOneAndDelete(
            {
                _id:courseId
            }
        )
         if(!course){
            return res.status(404).json({error:"course not found"})

         }

         res.status(201).json({message:"course delete successfully"})
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error:"error in delete course"})
        
    }
}

exports.GetCourse=async(req,res)=>{

    try {
        const allCourse=await Course.find()
    
    if(!allCourse){
        return res.status(404).json({error:"course is not found"})
    }
    res.status(201).json({message:"course is found",allCourse})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"error in find all course"})
    }
    
    
}

exports.CourseDetail=async(req,res)=>{
    const {courseId}=req.params;

    try {
        const course=await Course.findById(courseId)
        if(!course){
            return res.status(404).json({error:"course not found"})
        }
        
        res.status(201).json({message:"course detail",course})

    } catch (error) {
        console.log(error)
        res.status(500).json({error:"error in course detail server"})
        
    }
}

exports.BuyCourse=async(req,res)=>{
    const {userId}=req;
    const {courseId}=req.params;

    try {

        const course= await Course.findById(courseId)
        if(!course){
          return res.status(404).json({error:"course is not found"})
        }

        const existCourse=await Purchase.findOne({userId,courseId})
        if(existCourse){
            return res.status(400).json({error:"user has purchased this course"})
        }

        const newPurchase=new Purchase({userId,courseId})
        await newPurchase.save()
        res.status(201).json({message:"course purchased successfully",newPurchase})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"error in buy course server"})
        
    }
}