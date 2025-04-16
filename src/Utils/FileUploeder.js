import {v2 as cloudinary } from "cloudinary"
import { response } from "express";
import fs from "fs";
import { ApiError } from "../Utils/ApiError.js";

cloudinary.config({ 
    cloud_name: "dfpfgsiy4", 
    api_key: "658416213169248",
    api_secret:"8LveXJuLbQoWzKb6tGFgNthSHhM" 
  
});

const uploedOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null ;

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type : "auto"
        });
        // remove local file after upload
        fs.unlinkSync(localFilePath)
        // console.log(`File upload on cloudinary successfully`);

        return response.url
    } catch (error) {
        fs.unlinkSync(localFilePath)
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
}
const deleteOnCloudinary = async (oldAvaterUrl) => {
    try {
        const avater = oldAvaterUrl.splite("/").pop().splite(".");
        
       const response = await cloudinary.uploader.destroy(avater,{ resource_type: "auto" })
        return response
    } catch (error) {
        throw new ApiError(400, "error when deleteing cloudinary files")
    }
}

export {
    uploedOnCloudinary,
    deleteOnCloudinary
}
