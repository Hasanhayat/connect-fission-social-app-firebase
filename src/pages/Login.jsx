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
  Modal,
  Snackbar,
  Alert,
} from "@mui/material";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./pages.css";
import Loader from "./Loader";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  GithubAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
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

  // forget password
  const [forgetEmail, setForgetEmail] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const handleForget = () => {
    setOpenModal((prev) => !prev);
    setForgetEmail("");
  };

  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(false);
  const [alertType, setAlertType] = useState("success");

  const alertClose = () => {
    setShowAlert(false);
    setAlertMsg("");
  };
  const forgetPassword = () => {
    const auth = getAuth();
    sendPasswordResetEmail(auth, forgetEmail)
      .then(() => {
        // Password reset email sent!
        setAlertType("success");
        setAlertMsg("Forget Email Sent");
        setShowAlert(true);
        handleForget();
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setAlertType("error");
        setAlertMsg(errorMessage);
        setShowAlert(true);
        // ..
      });
  };

  // Mouse Events for holding the password visibility
  const handleMouseDownPassword = () => setShowPassword(true);
  const handleMouseUpPassword = () => setShowPassword(false);
  //providers

  const githubProvider = new GithubAuthProvider();

  //login with github


  const loginWithProvider = (provider) => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
    
        // The signed-in user info.
        const user = result.user;        
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GithubAuthProvider.credentialFromError(error);
        // ...
        setAlertType("error");
        setAlertMsg(errorMessage);
        setShowAlert(true);        
      });
    
  }


  return (
    <ThemeProvider theme={darkTheme}>
      <Snackbar
        open={showAlert}
        autoHideDuration={2000}
        onClose={alertClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        message="Added successfully"
      >
        <Alert
          onClose={alertClose}
          severity={alertType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertMsg}
        </Alert>
      </Snackbar>
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
          <p className="forget-link" onClick={handleForget}>
            Forget password
          </p>
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

        <hr width={250} size={1} />

         {/* Social Login Buttons */}
         <Box mt={2}>
          <Button variant="contained" fullWidth sx={{ mt: 1, backgroundColor: "#DB4437" }} onClick={() => loginWithProvider(googleProvider)}>
            <i className="fab fa-google" style={{ marginRight: 8 }}></i> Login with Google
          </Button>
          <Button variant="contained" fullWidth sx={{ mt: 1, backgroundColor: "#3b5998" }} onClick={() => loginWithProvider(facebookProvider)}>
            <i className="fab fa-facebook" style={{ marginRight: 8 }}></i> Login with Facebook
          </Button>
          <Button variant="contained" fullWidth sx={{ mt: 1, backgroundColor: "#333" }} onClick={() => loginWithProvider(githubProvider)}>
            <i className="fab fa-github" style={{ marginRight: 8 }}></i> Login with GitHub
          </Button>
        </Box>

      </Box>
      <Modal open={openModal} onClose={handleForget}>
        <Box
          sx={{
            width: 300,
            mx: "auto",
            mt: "20vh",
            p: 3,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Enter your Email
          </Typography>
          <TextField
            fullWidth
            type="email"
            value={forgetEmail}
            onChange={(e) => setForgetEmail(e.target.value)}
            label="email"
            variant="outlined"
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              forgetPassword();
            }}
          >
            Send Forget Email
          </Button>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default Login;
