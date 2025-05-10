import axios from "../../axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);//initialized to empty array i.e null 
  const [editingMode, setEditingMode] = useState(null);
  const { isAuthorized, user } = useContext(Context);

  const navigateTo = useNavigate();
  //Fetching all jobs of an employeer
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/job/getmyJobs",
          { withCredentials: true }
        );
        setMyJobs(data.myjobs);
      } catch (error) {
        toast.error(error.response.data.message);
        setMyJobs([]);//if any error comes reset setMyJobs to empty array 
      }
    };
    fetchJobs();
  }, []);
  if (!isAuthorized || (user && user.role !== "Employeer")) {
    navigateTo("/");
  }

  //Function For Enabling Editing Mode
  const handleEnableEdit = (jobId) => {
    //Here We Are Giving Id in setEditingMode because We want to enable only that job whose ID has been send.
    setEditingMode(jobId);
  };

  //Function For Disabling Editing Mode
  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  //Function For Updating The Job i.e editing the job details 
  const handleUpdateJob = async (jobId) => {
    const updatedJob = myJobs.find((job) => job._id === jobId);
    await axios
      .put(`http://localhost:5000/api/v1/job/update/${jobId}`, updatedJob, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setEditingMode(null);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  //Function For Deleting Job
  const handleDeleteJob = async (jobId) => {
    await axios //jobId accepted as a parameter when we click on job details 
      .delete(`http://localhost:5000/api/v1/job/delete/${jobId}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        //filter the previous job from setMyJobs 
        setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId)); // we write this for removing that job from our frontend;
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const handleInputChange = (jobId, field, value) => {
    // Update the job object in the jobs state with the new value
    setMyJobs((prevJobs) =>
      prevJobs.map((job) => 
        //changing the jobId values here for the specified field like title , location etc of a job 
    //map returns an array of the updated job 
        job._id === jobId ? { ...job, [field]: value } : job
    )
  );
  };

  //frontend design part focus here 
  return (
    <>
      <div className="myJobs page">
        <div className="container">
          <h3>Your Posted Jobs</h3>
          {
           myJobs && myJobs.length>0 ? (<>
          <div className="banner">
            {
              myJobs.map(element=>{
                return (
                  <div className="card" key={element._id}>
                    <div className="content">
                     <div className="short_fields">
                      <div>
                        <span>Title:</span>
                        <input type="text" disabled={editingMode!==element._id ? true:false}
                        value={element.title} onChange={(e)=> handleInputChange(element._id,"title",e.target.value)}/>
                      </div>
                      <div>
                        <span>Country:</span>
                        <input type="text" disabled={editingMode!==element._id ? true:false}
                        value={element.country} onChange={(e)=> handleInputChange(element._id,"country",e.target.value)}/>
                      </div>
                      <div>
                        <span>City:</span>
                        <input type="text" disabled={editingMode!==element._id ? true:false}
                        value={element.city} onChange={(e)=> handleInputChange(element._id,"city",e.target.value)}/>
                      </div>
                      <div>
                        <span>Category:</span>
                        <select value={element.category} onChange={(e)=> handleInputChange(element._id,"category",e.target.value)} disabled={editingMode!==element._id ? true:false}>
                        <option value="">Select Category</option>
                <option value="Software Developer">Software Developer</option>
                <option value="Mobile App Development">
                  Mobile App Development
                </option>
                <option value="Frontend Developer">
                Frontend Developer
                </option>
                <option value="MERN Stack Development">
                  MERN STACK Development
                </option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Artificial Intelligence">
                  Artificial Intelligence
                </option>
                <option value="Video Animation">Video Animation</option>
                <option value="MEAN Stack Development">
                  MEAN STACK Development
                </option>
                <option value="MEVN Stack Development">
                  MEVN STACK Development
                </option>
                <option value="Others">Others</option> 
                        </select>
                      </div>
                      <div>
                        <span>Salary:{" "}{
                          element.fixedSalary ? (<input type="number" value={element.fixedSalary} onChange={(e)=> handleInputChange(element._id,"fixedSalary",e.target.value)} disabled={editingMode!==element._id ? true:false} />): (
                          <div>
                            <input type="number" value={element.salaryFrom} onChange={(e)=> handleInputChange(element._id,"salaryFrom",e.target.value)} disabled={editingMode!==element._id ? true:false} />
                            <input type="number" value={element.salaryTo} onChange={(e)=> handleInputChange(element._id,"salaryTo",e.target.value)} disabled={editingMode!==element._id ? true:false} />
                          </div>)
                          }</span>
                      </div>
                      <div>
                        <span>Expired:</span>
                        <select value={element.expired} onChange={(e)=> handleInputChange(element._id,"expired",e.target.value)} disabled={editingMode!==element._id ? true:false}>
                          <option value={true}>True</option>
                          <option value={false}>False</option>

                        </select>
                      </div>
                      </div> 
                      <div className="long_field">
                        <div>
                          <span>Description:</span>
                          <textarea rows="5" value={element.description} onChange={(e)=> handleInputChange(element._id,"description",e.target.value)} disabled={editingMode!==element._id ? true:false}/>
                        </div>
                        <div>
                          <span>Location:</span>
                          <textarea rows="5" value={element.location} onChange={(e)=> handleInputChange(element._id,"location",e.target.value)} disabled={editingMode!==element._id ? true:false}/>
                        </div>

                      </div>
                    </div>
                    <div className="button_wrapper">
                          <div className="edit_btn_wrapper">
                            {
                              editingMode===element._id ? (
                              <><button onClick={()=>handleUpdateJob(element._id)} className="check_btn"><FaCheck/></button>
                              <button onClick={()=>handleDisableEdit()} className="cross_btn"><RxCross2/></button>
                              </>
                            ):(
                              <button onClick={()=> handleEnableEdit(element._id)} className="edit_btn">Edit</button>
                            )
                            }
                          </div>
                          <button onClick={()=> handleDeleteJob(element._id)} className="delete_btn">Delete</button>
                            
                    </div>
                  </div>
                );
              })
            }
          </div>
            </>
            )
            :(<p>You have not posted any job</p>)
          }
        </div>
      </div>
    </>
  );
};

export default MyJobs;