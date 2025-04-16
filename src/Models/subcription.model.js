import mongoose,{Schema} from "mongoose";

const subcriptionSchema = new Schema({
    subscriptionId : {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // Ensure unique subscription ID
        
    },
    channelId : {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true, // Ensure unique channel ID
    }
},{timestamps:true})

export const Subcriptions = mongoose.model("Subcriptions",subcriptionSchema)

