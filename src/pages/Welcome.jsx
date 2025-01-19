import React, { useState } from "react";
import { Link } from "react-router";

const Welcome = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Welcome to ConnectFission</h1>
      <div className="card">
        <button>
          <Link style={{textDecoration:"none"}} to={"signup"}>SignUp</Link>
        </button>

        <button>
          <Link style={{textDecoration:"none"}} to={"login"}>Login</Link>
        </button>
      </div>
    </>
  );
};

export default Welcome;
