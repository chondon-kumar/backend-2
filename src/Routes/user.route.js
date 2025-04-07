
import { Router } from "express"
import { registerUser } from "../Controllers/user.controller.js";
import {upload} from "..//Middlewares/multer.middleware.js"

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

export {userRouter}