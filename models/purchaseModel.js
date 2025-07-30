const mongoose=require('mongoose')


const purchaseSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"user"
    },

    courseId:{
        type:mongoose.Types.ObjectId,
        ref:"course"
    }
  
})

module.exports=mongoose.model("purchase",purchaseSchema);