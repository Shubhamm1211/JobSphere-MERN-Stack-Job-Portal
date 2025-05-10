import React from "react";
import { FaUserPlus } from "react-icons/fa";
import { MdFindInPage } from "react-icons/md";
import { IoMdSend } from "react-icons/io";

const HowItWorks = () => {
  return (
    <>
      <div className="howitworks">
        <div className="container">
          <h3>How JobSphere Works</h3>
          <div className="banner">
            <div className="card">
              <FaUserPlus />
              <p>Create Account</p>
              <p>
              Get started by signing up in seconds! Create your free account to explore job listings, connect with employers, and launch your career!
              </p>
            </div>
            <div className="card">
              <MdFindInPage />
              <p>Find a Job / Post a Job</p>
              <p>
              Whether you're hunting for the perfect role or hiring top talent, our platform has you covered. Explore job opportunities or post your openings to connect with the candidates—quickly and easily! 🚀
              </p>
            </div>
            <div className="card">
              <IoMdSend />
              <p>Apply For Job / Recruit Suitable Candidates</p>
              <p>
              Take the next step—apply for your dream job or find the perfect candidate for your company. Our platform bridges the gap between talent and opportunity, making hiring and job hunting fast, easy, and effective! 
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HowItWorks;