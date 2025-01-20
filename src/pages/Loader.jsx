import { CircularProgress } from "@mui/material";
import React from "react";
import './pages.css'

const Loader = () => {
  return (
    <div
      className="loader-div"
      style={{ height: "80vh" }}
    >
      <CircularProgress size={70} color="#B0BEC5" />
    </div>
  );
};

export default Loader;
