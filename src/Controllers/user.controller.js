import asyncHandler from "..//Utils/asyncHandler.js"
import {ApiError} from "../Utils/ApiError.js"
import {User} from "../Models/user.model.js"
import {deleteOnCloudinary, uploedOnCloudinary} from "../Utils/FileUploeder.js"
import {ApiResponse} from "../Utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { application } from "express"


const genareteAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.genarateAccessToken()
        const refreshToken = user.genarateRefreshToken()
 
        // update the user with refresh token
        // user.refreshToken = refreshToken
        // await user.save({ validateBeforeSave : false })
        await User.findByIdAndUpdate(
            userId,
            {
                $set : {
                    refreshToken : refreshToken
                }
            },
            {
                new : true
            }
        )

        return { refreshToken, accessToken }

    } catch (error) {
        throw new ApiError(500, "something went wrong  while genarating token" ,error)
    }
};

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
    const {userName, email, fullName, password,} = req.body
    // console.log("email",email);
    
    //details Validation -- not emty
    // advance Validation 
    if (
        [userName,email,fullName,password].some((field)=> field?.trim() === "")

    ) {
        throw new ApiError(400, "all fields are required")
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
        throw new ApiError(409,"The user already exists")
    }


    // avater and coverImage ref from pubic/temp Multer files
    const avaterLocalPath = req.files?.avater[0]?.path ;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path ;

    let coverImageLocalPath ;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }
     
    //check for avater
    if (!avaterLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    //upload on cloudinary 
   const avater = await uploedOnCloudinary(avaterLocalPath)
   const coverImage = await uploedOnCloudinary(coverImageLocalPath)

//    console.log("avater",avater);
//    console.log("coverImage",coverImage);
    // console.log("avaterLocalPath",avaterLocalPath);

    //check for coverImage
    // if (!coverImageLocalPath) {
    //     throw new ApiError(400, "Cover image file is required")
    // }

    
   //create user object and enty in DB
   const user = await User.create({
    fullName,
    avater : avater, 
    // check for coverImage
    coverImage : coverImage || "",
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

const logInUser = asyncHandler (async (req, res) => {
    // req data from body
    // userName and email check
    // find the user
    // Password  check
    // access and refresh token genarete
    // send cookies
    // response send

    // req data from body
    const {userName, email, password} = req.body

    // userName and email check
    if (!(userName || email)){
        throw new ApiError(401, "userName and email must needed")
    }

    const user = await User.findOne({
        $or:[{ email }, { userName }]
    })

    // find the user
    if (!user) {
        throw new ApiError(404, "this user not exists")
    }
    // console.log(user)
    //password check
    const passwordValid = await user.isPasswordCorrect(password) 
     // the capital User can not refrer this methods likes <ispasswordCorrect ,genarateAccessToken, genareteRefreshToken>

    if (!passwordValid) {
        throw new ApiError(401, "this password dont match")
    }
    // console.log("passwordValid",passwordValid);
    // console.log(genareteAccessAndRefreshToken);
    // access token and refresh token genarete
    const { accessToken, refreshToken} = await genareteAccessAndRefreshToken(user._id);
    

    // update this user 
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly : true,
        secure : true
    }


    // send cookies
    return res
    .status(200)
    .cookie("accessToken" , accessToken ,options)
    .cookie("refreshToken" , refreshToken ,options)
    .json(
        new ApiResponse(200, "this user successfully logged In",{
            user : loggedInUser , accessToken , refreshToken
        })
    )
    

});
const logOurUser = asyncHandler (async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined
            }
        },{
            new : true
        })

        const options = {
            httpOnly : true,
            secure : true
        }
    res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,"log Out successfully",{}))
        
});

const refreshAccessToken = asyncHandler (async(req, res) => {

    const incommingRefreshToken= req.cookie.refreshToken || req.body.refreshToken

    if (!incommingRefreshToken) {
        throw new ApiError(400, "unothorazed request")
    }

    const options = {
        httpOnly : true,
        secure: true
    }
    try {
        const deCodedRefreshToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(deCodedRefreshToken?._id)
    
        if (!user) {
            throw new ApiError(400, "Invalid refresh token") 
        }
    
        if (incommingRefreshToken !== user?.refreshToken) {
            throw new ApiError(400, "Refresh token is expired or used") 
        }
    
        const { accessToken, newrefreshToken} = await genareteAccessAndRefreshToken(user._id)
    
        res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(new ApiResponse(
            200, 
            "Access token Refreshed",
            {
                accessToken, 
                refreshToken: newrefreshToken
            }
        ))

    } catch (error) {
        throw new ApiError(401, error.message || "Invalid refresh token")
    }
});

const changePassword = asyncHandler (async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body
    
    if( !(newPassword === confirmPassword)){
        throw new ApiError(400, " new Password and confirm dont match")
    }

    const user = await User.findById(req.user._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "old password is not correct")
    }
    user.password = confirmPassword
    await user.save({ validationBeforeSave : false })

    res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully", {}))
});

const getCurrentUser = asyncHandler (async (req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
             "User details get successfully",
            {
                user: req.user
            }))
});

const updateAccountDetails = asyncHandler (async (req, res) => {
    const { fullName, email} = req.body
    if(!(fullName || email)){
        throw new ApiError(400, "all filds are required")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,{
        $set: {
            fullName: fullName,
            email: email
        }
    },{ new:true }).select("-password -refreshToken")

    return res 
    .status(200)
    .json(new ApiResponse(
        200,
        "Update account details successfully",
        user
    ))

});

const changerAvater = asyncHandler (async(req, res) => {
    const avaterLocalPath = req.files?.avater[0]?.path

    if (!avaterLocalPath) {
    throw new ApiError(200, "Averter file is missing")        
    }
    // console.log(req.user)
    // const user = await User.findById(req.user?._id)
    // console.log("user",user)
    // const oldAvater =  await user.avater

    // console.log(oldAvater)
    // await deleteOnCloudinary(oldAvater)
    const avater = await uploedOnCloudinary(avaterLocalPath)

    if (!avater) {
    throw new ApiError(200, "Error while uploading avater")        
    }

    const user =  await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set :{
                avater
            }
        },{ new :true}
    ).select("-password -refreshToken")
    return res
    .status(200)
    .json(new ApiResponse(200," Updata avater successfully ",user))

});
const changerCoverImage = asyncHandler (async(req, res) => {
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400,"Coverimage file is missing")
    }
    const coverImage = uploedOnCloudinary(coverImageLocalPath)

    if (!coverImage) {
    throw new ApiError(400, "error while uploding cover image")        
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage
            }
        },{ new : true }
    ).select("-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(200," Cover image upload successfully",user))
});


export {
    registerUser,
    logInUser,
    logOurUser,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    updateAccountDetails,
    changerAvater,
    changerCoverImage,

};