
import { Router } from "express"
import { changerAvater, logInUser, logOurUser, refreshAccessToken, registerUser,  } from "../Controllers/user.controller.js";
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
userRouter.route("/change-avater").post(
    upload.fields([
        {
            name: "avater",
            maxCount :1
        }
    ]),
    changerAvater);

//secure route
userRouter.route("/logout").post( verifyJwt, logOurUser);
userRouter.route("/refresh-token").post( refreshAccessToken);

export {userRouter}