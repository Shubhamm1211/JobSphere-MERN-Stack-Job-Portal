dotenv.config(); // looks in root (backend/) by default
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRouter.js"; //remember to add js here
import jobRouter from "./routes/jobRouter.js"; 
import applicationRouter from "./routes/applicationRouter.js"; 
import {dbConnection} from "./database/dbConnection.js";
import { errorMiddleware } from "./middlewares/error.js";

const app=express();

//give the path of environment variable 

// establish connection btw frontend and backend
app.use(cookieParser());
app.use(
    cors({
      origin: ["http://localhost:5173"], // the array will contain the info of different frontends that we would like to link
      method: ["GET", "POST", "DELETE", "PUT"],
      credentials: true,
    })
  );

// user authorization by the help of cookie parser
 
app.use(express.json()); // it will parse only the json data and other data will be neglected.
app.use(express.urlencoded({extended:true}));  // it will convert the string in json format
// The express.urlencoded() function is a built-in middleware provided by Express.
// It specifically handles URL-encoded form data sent in HTTP POST requests.
// When a client submits a form with method="POST" and enctype="application/x-www-form-urlencoded", the data is sent as URL-encoded key-value pairs (similar to query parameters).
// The express.urlencoded() middleware parses this data and makes it available in the req.body object.

// If extended is set to false, the data is parsed using the built-in querystring library, which supports only simple key-value pairs.
// If extended is set to true, the data is parsed using the qs library, which allows for more complex data structures (e.g., nested objects and arrays).

//for uploading files
app.use(fileUpload({
    useTempFiles :true,
    tempFileDir: "/tmp",
}));

app.use("/api/v1/user",userRouter);
app.use("/api/v1/application",applicationRouter);
app.use("/api/v1/job",jobRouter);


// db connection is made
dbConnection();

//using middlewares for error
app.use(errorMiddleware);

export default app;
