import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/JobSchema.js";

export const getAllJobs=catchAsyncError(async(req,res,next)=>{ 
    //find all the jobs that has not been expired 
    const jobs=await Job.find({expired:false});
    res.status(200).json({
        success:true,
        jobs,
    });
});


export const postJob = catchAsyncError(async (req, res, next) => { 
    //get the role of the user who has login 
    //req.user comes from auth.js , it contains complete details of the user 
    // it will come from authorised function since we execute that function in post job ..
    //here destructuring and getting the role 
    //or use const role = req.user.role 
    const { role } = req.user;   

    //if job seeker return error 
    if (role === "Job-Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resources!", 400)
      );
    }
    const {
      title,
      description,
      category,
      country,
      city,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
    } = req.body;
  
    //if any details not provided by user than return error 
    if (!title || !description || !category || !country || !city || !location) {
      return next(new ErrorHandler("Please provide full job details!", 400));
    }
    
    //while posting job at-least provide the job salary 
    if ((!salaryFrom || !salaryTo) && !fixedSalary) {    // this is for if any type of salary is not specified.
      return next(
        new ErrorHandler(
          "Please either provide fixed salary or ranged salary!",
          400
        )
      );
    }
  
    if (salaryFrom && salaryTo && fixedSalary) {
      return next(
        new ErrorHandler("Cannot Enter Fixed and Ranged Salary together!", 400)
      );
    }
    const postedBy = req.user._id; //who is the user who posted the job _id stored in mongoDB
    const job = await Job.create({
      title,
      description,
      category,
      country,
      city,
      location,
      fixedSalary,
      salaryFrom,
      salaryTo,
      postedBy,
    });
    res.status(200).json({
      success: true,
      message: "Job Posted Successfully!",
      job,
    });
  });

//every employeer see there posted job 
export const getmyJobs=catchAsyncError(async(req,res,next)=>{
    const {role}=req.user; //access the role of the user 
    if (role === "Job-Seeker") {
      return next(
        new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
      );
    }
    //we find the our job how? using postedBy which stores id of the user thus where postedBy = user id 
    //fetch that jobs only 
    const myjobs=await Job.find({postedBy:req.user._id});
    res.status(200).json({
      success:true,
      myjobs,
    });
});

//updating job 
export const  updateJob=catchAsyncError(async(req,res,next)=>{
  const {role}=req.user;
  if (role === "Job-Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  //updating job id a or b , using id and in the route access using same id 
    const {id}=req.params;
    let job=await Job.findById(id);//let as later it will be updated 
    if(!job){
      return next(new ErrorHandler("OOPS! Job not found",404));
    } 
    //if we found the job :- use findByIdAndUpdate for updating it need 3 parameter 
    job=await Job.findByIdAndUpdate(id,req.body,{
      new:true,
      runValidators:true,
      useFindAndModify:false
    })
    res.status(200).json({
      success:true,
      job,
      message:"Job Updated Succesfully!",
    })
});


//deleting a job 
//in the same way as we updated 
export const deleteJob=catchAsyncError(async(req,res,next)=>{
  const {role}=req.user;
  if (role === "Job-Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const {id}=req.params;
    let job=await Job.findById(id);
    if(!job){
      return next(new ErrorHandler("OOPS! Job not found",404));
    }
    await job.deleteOne(); //deleting a job 
    
    res.status(200).json({
      success:true,
      message:"Job Deleted Succesfully!",
    });
}); 


export const getSinglejob=catchAsyncError(async(req,res,next)=>{
  const {id}=req.params; //id of the job 
  try {
    const job=await Job.findById(id);
    if(!job){
      return next(new ErrorHandler("Job not found",404));
    }
    res.status(200).json({
      success:true,
      job
    })
  } catch (error) {
    return next(new ErrorHandler("INVALID ID/CastError",400));
  }
})