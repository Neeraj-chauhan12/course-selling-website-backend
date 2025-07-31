const express=require("express")
const { CreateCourse, UpdateCourse, DeleteCourse, GetCourse, CourseDetail, BuyCourse } = require("../controllers/courseControllers")
const userMiddleware = require("../middleware/userMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")


const router=express.Router()

router.post('/create',adminMiddleware,CreateCourse)
router.put('/update/:courseId',adminMiddleware,UpdateCourse)
router.delete('/delete/:courseId',adminMiddleware,DeleteCourse)
router.get('/findCourse',GetCourse)
router.get('/:courseId',CourseDetail)

router.post('/purchase/:courseId',userMiddleware,BuyCourse)



module.exports=router