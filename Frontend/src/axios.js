import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://jobsphere-mern-stack-job-portal-backend.onrender.com/api/v1",
  withCredentials: true,
});

export default instance;
