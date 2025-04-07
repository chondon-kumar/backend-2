import asyncHandler from "..//Utils/asyncHandler.js"
import {ApiError} from "../Utils/ApiError.js"
import {User} from "../Models/user.model.js"
import {uploedOnCloudinary} from "../Utils/FileUploeder.js"
import {ApiResponse} from "../Utils/ApiResponse.js"

const registerUser = asyncHandler( async (req, res) => {
     // get user details from frontend
     // validation -not emty
     // check if user alredy exists :usesName, email
     // check for image check for avater
     // upload them to cloudinary avater
     // create user object create entry in db
     // remove password and refresh token field from respose
     // check for user creation 
     // return res.

     //get user details from fronend
    const {userName, email, fullName, password} = req.body
    console.log("email",email);
    
    //details Validation -- not emty
    // advance Validation 
    if (
        [userName,email,fullName,password].some((field)=> field?.trim() === "")

    ) {
        throw new ApiError(400, "all frild are required")
    }
    // this is begener validation 
    // if (fullName === "") {
    //     throw new ApiError(400,"fullname is required")        
    // }

     // check if user alredy exists :usesName, email

    const existendUser = await User.findOne({
        $or :[{ userName }, { email }]
    })

    if (existendUser) {
        throw new ApiError(409,"The user has alredy exists")
    }

    // avater and coverImage ref from Multer files
    
    const avaterLocalPath = req.files?.avater[0]?.path || "avater" ;
    const coverImageLocalPath = req.files?.coverImage[0]?.path || "coverImage" ;
    
    //check for avater
    if (!avaterLocalPath) {
        throw new ApiError(400, " Avater file is required")
    }

    //upload on cloudinary 
   const avater = await uploedOnCloudinary(avaterLocalPath)
   const coverImage = await uploedOnCloudinary(coverImageLocalPath)

    //check for avater
   if (!avater) {
    throw new ApiError(400, " Avater file is required")
   }

    

   //create user object and enty in DB
   const user = await User.create({
    fullName,
    avater : avater.url,
    // check for coverImage
    coverImage : coverImage?.url || "",
    userName : userName.toLowerCase(),
    email,
    password
   })

   // remove password and refresh token fild from response
   const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
   );
   // check for User creation 
   if (!createdUser) {
        throw new ApiError(500, "someting wint wrong while registering User")
   }
   // return respose

   return res.status(200).json(
     new ApiResponse(200,createdUser,"user register successfully")
   )

});

export {registerUser};