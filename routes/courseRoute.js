const express=require("express")
const { CreateCourse, UpdateCourse, DeleteCourse, GetCourse, CourseDetail } = require("../controllers/courseControllers")

const router=express.Router()

router.post('/create',CreateCourse)
router.put('/update/:courseId',UpdateCourse)
router.delete('/delete/:courseId',DeleteCourse)
router.get('/findCourse',GetCourse)
router.get('/:courseId',CourseDetail)



module.exports=router