import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";

// synchronous and asynchronous error not handled by us 
export const register = catchAsyncError(async(req,res,next)=>{
    const {name,email,phone,role,password}=req.body;

        //if user while registering doesn't provide any of the above 5 things error returned to the user
    if(!name|| !email || !phone || !role || !password){
        return next(new ErrorHandler("Please fill full details!",400));
    }
    const isEmail=await User.findOne({email}); //only 1 user with this email 

    //if mail found i.e user already exist in our db
    if(isEmail){
        return next(new ErrorHandler("Email already exists!"));

    }
    //else create the user 
    const user=await User.create({
        name,
        email,
        phone,
        role,
        password
    });
    //this will call from utils the jwt token created 
    sendToken(user,200,res,"User Registered Successfully"); 
  /* res.status(200).json({
    success: true,
    message: "User Registered Successfully",
    User,
   });*/
});


//how will user login -> rapped inside a middleware catch async which handles all the error 
export const login=catchAsyncError(async(req,res,next)=>{
    const {email,password,role}=req.body;

    //if user doesn't give any one thing -> return error 
    if(!email || !password || !role){
        return next(new ErrorHandler("Please Fill all details",400));
    } 
    //since,email unique to all user -> get its mail and password 
    const user=await User.findOne({email}).select("+password"); 
    //no user found 
    if(!user){
        return next(new ErrorHandler("Invalid Email or Password",400));
    } 
    //if mail correct see password entered is correct or not :- using compare password function written 
    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email or Password",400));
    } 
    //also check for the role of the user 
    if(user.role!==role){
        return next(new ErrorHandler("Role not matched!",400));
    }
    sendToken(user,200,res,"User Logged in Successfully");

});

export const logout=catchAsyncError(async(req,res,next)=>{
    res.status(201).cookie("token","",{
        expires:new Date(
            Date.now()
        ),
        httpOnly: true,
       secure:true,   //for user to get logout this both used 
       sameSite:"None", //for user to get logout this both used 
    }).json({success:true,
        message:"User Logout successfully!",
    }) ; // after logout the cookie which is stored in local storage this will make it null
});

//get user at front end for authentication of user 
export const getUser=catchAsyncError((req,res,next)=>{
    const user=req.user; //user stored here 
    // console.log(user);
    // if(!user){
    //     return next(new ErrorHandler("User not found!",400));
    // }
    res.status(200).json({
        success:true,
        user,
    });
});
