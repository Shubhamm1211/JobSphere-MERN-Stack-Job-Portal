import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import cloudinary from "cloudinary";
import { dbConnection } from "./database/dbConnection.js";

dbConnection(); 
//using version 2 of cloudinary 
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`);
});