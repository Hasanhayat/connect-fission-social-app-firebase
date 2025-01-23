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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router";
import Loader from "./Loader";

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

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Signup - ConnectFission";
  }, []);

  // Validation Schema with Yup
  const validationSchema = Yup.object({
    name: Yup.string().required("Enter Username"),
    email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const auth = getAuth();
      setLoading(true);
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
          //username sent 
          updateProfile(auth.currentUser, {
            displayName: values.name, photoURL: "https://example.com/jane-q-user/profile.jpg"
          }).then(() => {
            console.log("name sent");
          }).catch((error) => {
            console.log("nameErr",error);
          });
          // Signed up
          const user = userCredential.user;
          console.log("userCredential", userCredential);
          setLoading(false);
          navigate("/home");
        })
        .catch((error) => {
          setLoading(false);
          console.log(error.code);
          const errorCode = error.code;
          const errorMessage = error.message;

          formik.errors.email = errorMessage;
        });
    },
  });

  // Mouse Events for holding the password visibility
  const handleMouseDownPassword = () => setShowPassword(true);
  const handleMouseUpPassword = () => setShowPassword(false);
  const handleMouseDownConfirmPassword = () => setShowConfirmPassword(true);
  const handleMouseUpConfirmPassword = () => setShowConfirmPassword(false);

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
          Signup
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            variant="outlined"
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
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
                      className={`far ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                  onTouchStart={handleMouseDownConfirmPassword}
                  onTouchEnd={handleMouseUpConfirmPassword}
                    onMouseDown={handleMouseDownConfirmPassword}
                    onMouseUp={handleMouseUpConfirmPassword}
                    onMouseLeave={handleMouseUpConfirmPassword}
                    edge="end"
                    style={{ outline: "none" }}
                  >
                    <i
                      className={`far ${
                        showConfirmPassword ? "fa-eye-slash" : "fa-eye"
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
              "Signup"
            )}
          </Button>
          <p className="account-msg">
            Already have an account? <Link to={"/login"}>Login</Link>
          </p>
        </form>
      </Box>
    </ThemeProvider>
  );
};

export default Signup;
