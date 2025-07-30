const express=require("express")
const { CreateCourse, UpdateCourse, DeleteCourse, GetCourse, CourseDetail, BuyCourse } = require("../controllers/courseControllers")
const userMiddleware = require("../middleware/userMiddleware")


const router=express.Router()

router.post('/create',CreateCourse)
router.put('/update/:courseId',UpdateCourse)
router.delete('/delete/:courseId',DeleteCourse)
router.get('/findCourse',GetCourse)
router.get('/:courseId',CourseDetail)

router.post('/purchase/:courseId',userMiddleware,BuyCourse)



module.exports=router