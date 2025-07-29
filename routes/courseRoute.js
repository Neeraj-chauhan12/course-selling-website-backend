const express=require("express")
const { Create } = require("../controllers/courseControllers")

const router=express.Router()

router.post('/create',Create)



module.exports=router