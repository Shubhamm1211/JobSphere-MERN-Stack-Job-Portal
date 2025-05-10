import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import  ErrorHandler  from "../middlewares/error.js";
import { Job } from "../models/JobSchema.js";
import { Application } from "../models/applicationSchema.js";
import cloudinary from 'cloudinary';

//how will 1 employeer get all the application of employeer

export const employeerGetAllApplications=catchAsyncError(async(req,res,next)=>{  // this will fetch all the applications that is posted by a particular employeer
    const { role } = req.user;   // it will come from authorised function since we execute that function in post job ..
    if (role === "Job-Seeker") {
      return next(
        new ErrorHandler("Job Seeker is not allowed to access this resources!", 400)
      );
    }

    const {_id}=req.user;
    // if any application that user has posted , if that id matches with employerID.user id send it in response  
    const applications=await Application.find({'employerID.user':_id});
    res.status(200).json({
        success:true,
        applications
    });
});


// every job-seeker can also see where they have applied for 
export const jobseekerGetAllApplications=catchAsyncError(async(req,res,next)=>{  // this will fetch all the applications that is posted by a particular employeer
    const { role } = req.user;   // it will come from authorised function since we execute that function in post job ..
    if (role === "Employeer") {
      return next(
        new ErrorHandler("Employeer is not allowed to access this resources!", 400)
      );
    }
  
    const {_id}=req.user;
    const applications=await Application.find({'applicantID.user':_id});
    res.status(200).json({
        success:true,
        applications
    });
  });

  //every job seeker has been allowed to delete there application where they have applied 
  //but employeer can't delete the job seeker application 
  export const jobseekerDeleteApplication=catchAsyncError(async(req,res,next)=>{
    const { role } = req.user;   // it will come from authorised function since we execute that function in post job ..
    if (role === "Employeer") {   // employer cannot delete any applications.
      return next(
        new ErrorHandler("Employeer is not allowed to access this resources!", 400)
      );
    }
    const {id}=req.params;
    const application=await Application.findById(id);
    if(!application){
      return next(new ErrorHandler("OOPS aplication not found",404));
  
    }
    await application.deleteOne(); //deleting the application 
    res.status(200).json({
      success:true,
      message:"Appilcaion deleted successfully"
    });
  });
  

//now,post a application -> uses file handling , file stored in cloudinary 
export const postApplication = catchAsyncError(async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resources!", 400)
      );
    }
    //if we don't have any file than ask for the resume file 
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Resume File Required!", 400));
    }
    //but if we have the resume file 
    const { resume } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"]; 
    //like .png , .jpg this are mimetype here for our resume 
    if (!allowedFormats.includes(resume.mimetype)) {
      return next(
        new ErrorHandler("Invalid file type. Please upload your resume in a PNG, JPG OR WEBP format.", 400)
      );
    }
    //storing the response of cloudinary 
    const cloudinaryResponse = await cloudinary.uploader.upload(
      resume.tempFilePath
    );
    
    //if no response or the response generated contains error 
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
    } 
    //get details from the application schema we created 
    const { name, email, coverLetter, phone, address, jobId } = req.body; 
    //we get jobId for checking that whether this job exists or had been expired 

    //2 parameter because the way we created the application schema :- user and role for applicantID 
    //id of applicant , job seeker who applies for the job  
    const applicantID = {
      user: req.user._id,
      role: "Job-Seeker",//since applying for job 
    };
    if (!jobId) {
      return next(new ErrorHandler("Job not found!", 404));
    }
    //get the job using jobId 
    const jobDetails = await Job.findById(jobId); 
    //if we don't found any details for the job return error 
    if (!jobDetails) {
      return next(new ErrorHandler("Job not found!", 404));
    }
    //id of employeer who post the job
    const employerID = {
      user: jobDetails.postedBy,
      role: "Employeer",
    };
    if (
      !name ||
      !email ||
      !coverLetter ||
      !phone ||
      !address ||
      !applicantID ||
      !employerID ||
      !resume
    ) {
      return next(new ErrorHandler("Please fill all fields!", 400));
    }
    const application = await Application.create({
      name,
      email,
      coverLetter,
      phone,
      address,
      applicantID,
      employerID, 
      //in resume in application schema there is one public id and one url 
      resume: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
    res.status(200).json({
      success: true,
      message: "Application Submitted!",
      application,
    });
  });