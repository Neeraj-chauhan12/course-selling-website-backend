const express=require('express');
const { register, loginControllers, logoutControllers } = require('../controllers/adminControllers');

const router=express.Router();

router.post("/register",register)
router.post("/login",loginControllers)
router.post("/logout",logoutControllers)


module.exports=router