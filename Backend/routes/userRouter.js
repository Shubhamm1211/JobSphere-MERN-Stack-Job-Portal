import express from "express";
import {getUser, login, logout, register} from "../controllers/userController.js";
import { isAuthoried } from "../middlewares/auth.js";


const router=express.Router();

//user will post data using post 
router.post("/register", register); //post request 
router.post("/login",login);
//check user authentication 
router.get("/logout",isAuthoried,logout); //get request 
router.get("/getuser",isAuthoried,getUser);

export default router;
