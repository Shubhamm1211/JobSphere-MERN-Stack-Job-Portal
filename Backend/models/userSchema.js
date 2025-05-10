import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


//creating schema for the user 
const userSchema=new mongoose.Schema({
    //what do we need from the user 
    name:{
        type: String,
        required: [true,"Please provide your name!"],
        minLength :[3,"Name must contain at least 3 characters!"],
        maxLength :[30,"Name cannot exceed 30 characters!"],
    },
    email:{
        type: String,
        required: [true,"Please provide your email!"],
        //validate mail that it is valid or not , if not return msg to provide valid mail 
        validate: [validator.isEmail,"Please provide a valid email"], 
    },
    phone:{
        type:Number,
        required:[true,"Please provide your mobile number"]
    },
    password:{
        type: String,
        required: [true,"Please Type your Password"],
        minLength :[8,"Name must contain at least 8 characters!"],
        maxLength :[32,"Name cannot exceed 32 characters!"],
        select: false
    },
    //role of user -> employeer or job seeker 
    role:{
        type: String,
        required :[true,"Please provide your role"],
        enum:["Job-Seeker", "Employeer"],  // enum due to we have to give only 2 options.
    },
    //when user was created 
    createdAt:{
        type: Date,
        default: Date.now,
    },
});

//ENCRYPTING THE PASSWORD WHEN THE USER REGISTERS OR MODIFIES HIS PASSWORD
// hashing the password
//before saving userSchema call this async function
userSchema.pre("save",async function(next){  // The Mongoose Schema API pre() method is used to add a pre-hook to the mongoose Schema methods and can be used to perform pre Schema method operations.
    if(!this.isModified("password")){  // if this password is not modified i.e no new user then simply call next function
        next();
    }
    this.password=await bcrypt.hash(this.password,10);  // if you write it 8 then will hash weekly and if 12 strong but time consuming so keep it 10.
});

// Comparing Password of user entered and encrypted password
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
};

//Generating a Jwt token for authorization
userSchema.methods.getJWTToken=function(){
    return jwt.sign({
        id:this._id
    },process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE, //in how much time jwt expires
    });
};
export const User=mongoose.model("User",userSchema);
