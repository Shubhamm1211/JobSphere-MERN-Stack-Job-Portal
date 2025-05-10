import express from "express";
import { deleteJob, getAllJobs, getSinglejob, getmyJobs, postJob, updateJob } from "../controllers/jobController.js";
import { isAuthoried } from "../middlewares/auth.js";



const router=express.Router();

router.get("/getall",getAllJobs);
//isAuthorized first calls and brings the req.user 
//this will run only when user role will be Employeer
router.post("/post",isAuthoried,postJob);
router.get("/getmyjobs",isAuthoried,getmyJobs); 
//id stores the id of the user and they are updated than 
router.put("/update/:id",isAuthoried,updateJob);
router.delete("/delete/:id",isAuthoried,deleteJob);
router.get("/:id",isAuthoried,getSinglejob);
export default router;
