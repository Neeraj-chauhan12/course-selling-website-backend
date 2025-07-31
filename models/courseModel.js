const mongoose=require("mongoose")

const courseSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },

    image:{
        public_id:{
            type:String,
            required:true
        },

        url:{
            type:String,
            required:true
        }
    },

    creatorId:{
        type:mongoose.Types.ObjectId,
        ref:"admin"
    }
})

module.exports=mongoose.model("course",courseSchema)