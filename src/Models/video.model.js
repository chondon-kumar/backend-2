import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new mongoose.Schema({
    videoFile : {
        type : String,
        required : true,
    },
    thumbnill : {
        type : String,
        required : true,
    },
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    duration : {
        type : Number,
        required : true,
    },
    views : {
        type : Number,
        default : 0,
    },
    isPublished : {
        type : Boolean,
        default : true
    },


},{timestamps:true});



videoSchema.plugin(mongooseAggregatePaginate); // this pugin setup in the bottom

export const Video = mongoose.model("Video",videoSchema);