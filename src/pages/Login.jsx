import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  IconButton,
  CssBaseline,
  ThemeProvider,
  createTheme,
  CircularProgress,
} from "@mui/material";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./pages.css";
import Loader from "./Loader";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router";

// Create a dark theme using Material-UI

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
  },
});

const Login = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Login - ConnectFission";
  }, []);

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  // Validation Schema with Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const auth = getAuth();
      setLoading(true);
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          // ...
          navigate("/home");
          dispatch({ type: "USER_LOGIN", payload: user });

          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);

          const errorCode = error.code;
          console.log(error);

          const errorMessage = error.message;
          formik.errors.email = errorMessage;
        });
    },
  });

  // Mouse Events for holding the password visibility
  const handleMouseDownPassword = () => setShowPassword(true);
  const handleMouseUpPassword = () => setShowPassword(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          maxWidth: 400,
          mx: "auto",
          mt: 4,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography align="left" variant="h5" mb={2}>
          Login
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            variant="outlined"
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            variant="outlined"
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onTouchStart={handleMouseDownPassword}
                    onTouchEnd={handleMouseUpPassword}
                    onMouseDown={handleMouseDownPassword}
                    onMouseUp={handleMouseUpPassword}
                    onMouseLeave={handleMouseUpPassword} // To ensure hiding if the user drags away
                    edge="end"
                    style={{ outline: "none" }}
                  >
                    <i
                      className={`fas ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            {loading ? (
              <div style={{ height: "" }}>
                <CircularProgress size={20} color="white" />
              </div>
            ) : (
              "login"
            )}
          </Button>
          <p className="account-msg">
            Don't have an account? <Link to={"/signup"}>Sign Up</Link>
          </p>
        </form>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
