import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    userName :{
        type : String,
        required : true,
        lowercase : true,
        unique : true,
        trim : true,
        index : true, //for searchable element ...more optimise and better searching
    },
    email : {
        type : String,
        required : true,
        lowercase : true,
        unique : true,
        trim : true, // Remove whiteSpace start and end
    },
    fullName : {
        type : String,
        required : true,
        trim : true,
    },
    avater : {
        type : String,
        required : true,
    },
    coverImage : {
        type : String
    },
    password : {
        type : String,
        required : [true, "password field required"]
    },
    refreshToken : {
        type : String,
        required : true,
    },
    watchHistory : [
        {
            type : Schema.Types.ObjectId,
            ref : "Video"
        }
    ]


},{timestamps: true});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next()
});

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.genarateAccecToken = function (){
    jwt.sign(
        {
            _id : this._id,
            userName : this.userName,
            email : this,email,
            fullName : this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : ACCESS_TOKEN_EXPIRE
        }
    )
};
userSchema.methods.genarateRefreshToken = function (){
    jwt.sign(
        {
            _id : this._id, 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : REFRESH_TOKEN_EXPIRE
        }
    )
}
export const User = mongoose.model("User", userSchema);