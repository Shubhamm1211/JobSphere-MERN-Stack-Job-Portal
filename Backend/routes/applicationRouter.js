import express from "express";
import { employeerGetAllApplications, jobseekerDeleteApplication, jobseekerGetAllApplications, postApplication } from "../controllers/applicationController.js";
import { isAuthoried } from "../middlewares/auth.js";

const router=express.Router();

router.get("/employer/getall",isAuthoried,employeerGetAllApplications);
router.get("/jobseeker/getall",isAuthoried,jobseekerGetAllApplications);
router.delete("/delete/:id",isAuthoried,jobseekerDeleteApplication);
router.post("/postapplication",isAuthoried,postApplication);


export default router;
