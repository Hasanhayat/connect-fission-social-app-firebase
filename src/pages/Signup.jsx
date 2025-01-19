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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Create a dark theme using Material-UI
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Light Blue
    },
    background: {
      default: "#121212", // Dark Background
      paper: "#1e1e1e", // Darker Paper
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
  },
});

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    document.title = "Signup - ConnectFission";
  }, []);

  // Validation Schema with Yup
  const validationSchema = Yup.object({
    userName: Yup.string().required("User Name is required"),
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
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

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
            label="User Name"
            name="userName"
            fullWidth
            margin="normal"
            value={formik.values.userName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.userName && Boolean(formik.errors.userName)}
            helperText={formik.touched.userName && formik.errors.userName}
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
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
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
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Signup
          </Button>
        </form>
      </Box>
    </ThemeProvider>
  );
};

export default Signup;
