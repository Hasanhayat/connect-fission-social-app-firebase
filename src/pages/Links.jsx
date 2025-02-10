import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router";
import Login from "./Login";
import Signup from "./Signup";
import Welcome from "./Welcome";
import Home from "./Home";
import { GlobalContext } from "../context/Context";
import Profile from "./Profile";
import Nav from "./Nav";

const Links = () => {
  const { state, dispatch, logout } = useContext(GlobalContext);

  return state.isLogin ? (
    <>
    <Nav />
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
    </>
  ) : (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to={"/"} />} />
    </Routes>
  );
};

export default Links;
