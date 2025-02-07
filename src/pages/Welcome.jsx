import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";
import { GlobalContext } from "../context/Context";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { CircularProgress } from "@mui/material";
import Typed from "typed.js";
import DemoPosts from "./DemoPosts";
import "./pages.css";

const Welcome = () => {
  const { state, dispatch, logout } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const type = () => {
    var typed = new Typed("#typed", {
      strings: [
        `Hi,<i>${auth?.currentUser?.displayName}</i>`,
        `Welcome to ConnectFission`,
      ],
      typeSpeed: 60,
      backSpeed: 70,
      cursorChar: "",
    });
  };
  const auth = getAuth();
  useEffect(() => {
    document.title = "Welcome - ConnectFission";

    setLoading(true);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user", user);
        dispatch({ type: "USER_LOGIN", payload: user });
        const uid = user.uid;
        setLoading(false);
        // ...
        type();
      } else {
        // User is signed out
        // ...
        dispatch({ type: "USER_LOGOUT" });
        console.log("User Not Found");
        setLoading(false);
      }
    });
  }, []);
  return (
    <div className="welcome">
      <h1 id="typed">
        {state.isLogin === false ? "Welcome to ConnectFission" : ""}
      </h1>

      {loading ? (
        <CircularProgress size={45} color="#B0BEC5" />
      ) : state.isLogin ? (
        <>
          <div className="card">
            <button>
              <Link style={{ textDecoration: "none" }} to={"/home"}>
                Home
              </Link>
            </button>
            <button>
              <Link style={{ textDecoration: "none" }} to={"/profile"}>
                Profile
              </Link>
            </button>
          </div>

          <button style={{ margin: 20 }} onClick={logout}>
            LOGOUT
          </button>
        </>
      ) : (
        <>
          <div className="card">
            <button>
              <Link style={{ textDecoration: "none" }} to={"signup"}>
                SignUp
              </Link>
            </button>

            <button>
              <Link style={{ textDecoration: "none" }} to={"login"}>
                Login
              </Link>
            </button>
          </div>
        </>
      )}

      {!loading ? <DemoPosts /> : null}
    </div>
  );
};

export default Welcome;
