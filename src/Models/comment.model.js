import mongoose, {Schema} from "mongoose";

const commentSchema = new Schema({
    owner :{
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    video : {
        type : mongoose.Types.ObjectId,
        ref : "Video"
    },
    content : {
        type : String ,
        required : true

    }
},{timestamps : true})

export const Comment = mongoose.model("Comment", commentSchema)