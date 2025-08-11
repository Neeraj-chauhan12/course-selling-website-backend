const express=require('express');
const app=express();
const path=require('path')
//import { v2 as cloudinary } from 'cloudinary';
const cloudinary =require("cloudinary").v2
const cors=require('cors')
const userRouter=require('./routes/userRoutes')
const adminRouter=require('./routes/adminRoute')
const courseRouter=require('./routes/courseRoute')


const dotenv=require('dotenv');
const connectdb = require('./dbconnect');
const fileUpload = require('express-fileupload');
dotenv.config();


//middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:process.env.FRONTEND_PORT,
    credentials:true,
    methods:["GET","POST","UPDATE","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
}))

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use('/api/v1/user',userRouter);
app.use('/api/v1/admin',adminRouter)
app.use('/api/v1/course',courseRouter)

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key:process.env.CLOUD_API, 
        api_secret: process.env.CLOUD_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
   

const PORT=process.env.PORT || 5000;
connectdb().then(()=>{
    app.listen(PORT,()=>{
    console.log("the app is running on port",PORT)
})

})

