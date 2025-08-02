const express=require('express');
const { register, loginControllers, logoutControllers, purchaseControllers } = require('../controllers/userControllers');
const userMiddleware = require('../middleware/userMiddleware');
const router=express.Router();

router.post("/register",register)
router.post("/login",loginControllers)
router.get("/logout",logoutControllers)

router.get('/purchase',userMiddleware,purchaseControllers)

module.exports=router

