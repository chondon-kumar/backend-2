
import { Router } from "express"
import {
    changePassword,
    changerAvater, 
    changerCoverImage, 
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    logInUser, 
    logOutUser, 
    refreshAccessToken, 
    registerUser,
    updateAccountDetails, 
    
} from "../Controllers/user.controller.js";
import {upload} from "..//Middlewares/multer.middleware.js"
import { verifyJwt } from "../Middlewares/Atuh.middleware.js"

const userRouter = Router();

userRouter.route("/register").post(
    upload.fields([
        {
            name : "avater",
            maxCount : 1
        },{
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
)
userRouter.route("/login").post(logInUser);
userRouter.route("/change_avater").patch(verifyJwt, upload.single("avater"),changerAvater);
userRouter.route("/change_cover_imege").patch( verifyJwt,upload.single("coverImage"),changerCoverImage
);
userRouter.route("/editUser").patch(verifyJwt, updateAccountDetails);
userRouter.route("/user_deteils").get(verifyJwt, getCurrentUser);
userRouter.route("/c/:userName").get(verifyJwt, getUserChannelProfile);
userRouter.route("/watchHistory").get(verifyJwt, getWatchHistory);




//secure route
userRouter.route("/logout").post( verifyJwt, logOutUser);
userRouter.route("/refresh_token").get(verifyJwt, refreshAccessToken);
userRouter.route("/password_change").patch(verifyJwt, changePassword)
userRouter.route("/get_currentUser").get(verifyJwt, getCurrentUser)


export {userRouter}