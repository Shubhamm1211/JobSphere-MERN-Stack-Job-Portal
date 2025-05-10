import React, { useContext } from 'react'
import { Context } from "../../main";
import { Link } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
import { AiFillGithub } from "react-icons/ai";

const Footer = () => {
  const { isAuthorized } = useContext(Context);
  return (
    //if user authorized than show the footer else we won't show the footer 
    //we have defined the css in accordance to it only 
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; All Rights Reserved By Shubham Agrawal.</div>
      <div>
        <Link to={"https://github.com/Shubhamm1211"} target="_blank">
          <AiFillGithub />
        </Link>
        <Link to={"https://www.linkedin.com/in/shubham-agrawal-079334245/"} target="_blank">
          <FaLinkedin />
        </Link>
      </div>
    </footer>
  );
};

export default Footer