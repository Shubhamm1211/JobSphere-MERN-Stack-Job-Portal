import mongoose from "mongoose";
import validator from "validator";

const applicationSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide your name!"],
        minLength:[3,"Name should contains at least 3 characters"],
        maxLength:[30,"Name should not contains more than 30 characters"],
    },
    email:{
        type:String,
        validator:[validator.isEmail,"Please provide a valid email"],
        required:[true,"Please provide your email"],

    },
    coverLetter:{
        type:String,
        required:[true,"Please provide your cover letter!"],
    },
    phone:{
        type:Number,
        required:[true,"Please provide your phone number"],
    },
    address:{
        type:String,
        required:[true,"Please provide your address"],

    },
    resume:{
        //public_id comes from cloudinary 
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true,
        }
    }, 
    //track the id of job seeker
    applicantID:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,

        },
        role:{
            type:String,
            enum:["Job-Seeker"],
            required:true,
        }
    },
    employerID:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,

        },
        role:{
            type:String,
            enum:["Employeer"],
            required:true,
        },
    },
});



export const Application=mongoose.model("Application",applicationSchema);