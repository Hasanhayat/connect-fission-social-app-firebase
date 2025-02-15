import React from "react";
import { motion } from "framer-motion";
import "./pages.css";

import firebaseLogo from "../assets/firebase.svg";
import gitLogo from "../assets/git.svg";
import githubLogo from "../assets/github.svg";
import facebookLogo from "../assets/facebook.svg";
import googleLogo from "../assets/google.svg";
import reactLogo from "../assets/react.svg";
import muiLogo from "../assets/mui.svg";
import axiosLogo from "../assets/axios.svg";

const logos = [
  googleLogo,
  firebaseLogo,
  reactLogo,
  githubLogo,
  facebookLogo,
  axiosLogo,
  muiLogo,
  gitLogo,

  
];

const TechLogos = () => {
  return (
    <div className="logo-container">
      <motion.div
        className="logo-track"
        initial={{ x: "65%" }}
        animate={{ x: "-100%" }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
      >
        {[...logos].map((logo, index) => (
          <img key={index} src={logo} alt="tech-logo" className="logo" />
        ))}
      </motion.div>
    </div>
  );
};

export default TechLogos;
