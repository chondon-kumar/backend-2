import { ApiError } from "../Utils/ApiError.js";
import asyncHandler from "../Utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../Models/user.model.js";


export const verifyJwt = asyncHandler (async (req, _, next) =>{
    try {
        const token =  req.cookies?.accessToken || req.header("uthorization")?.replace("Bearer ", "")
    
        if (!token) {
            throw new ApiError( 400 , " this token doesnot exists")
        }
    
        const deCodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(deCodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(400 , "access token not valid")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(400,error?.message || "Invalid access token")
    }
})