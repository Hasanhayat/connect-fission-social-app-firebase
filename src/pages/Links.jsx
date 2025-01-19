import React from "react";
import { Navigate, Route, Routes } from "react-router";
import Login from "./Login";
import Signup from "./Signup";
import Welcome from "./Welcome";
import Home from "./Home"

const Links = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to={"/home"} />} />
    </Routes>
  );
};

export default Links;
