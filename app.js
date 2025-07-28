const express=require('express');
const app=express();
const path=require('path')
const cors=require('cors')
const userRouter=require('./routes/userRoutes')
const adminRouter=require('./routes/adminRoute')


const dotenv=require('dotenv');
const connectdb = require('./dbconnect');
dotenv.config();


//middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}))
app.use(cors())

app.use('/user',userRouter);
app.use('/admin',adminRouter)


const PORT=process.env.PORT || 5000;
connectdb()
app.listen(PORT,()=>{
    console.log("the app is running on port",PORT)
})