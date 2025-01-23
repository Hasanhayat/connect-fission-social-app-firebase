import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Avatar,
  IconButton,
} from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

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

const Profile = () => {
  const [profileImage, setProfileImage] = useState(null);

  // Validation Schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Enter a valid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
    },
    validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify({ ...values, profileImage }, null, 2));
    },
  });

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          mt: 4,
          p: 3,
          boxShadow: 3,
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="h5" align="center" mb={3}>
          Profile Details
        </Typography>
        <Box display="flex" justifyContent="center" mb={3}>
          <Avatar
            src={profileImage}
            sx={{
              width: 80,
              height: 80,
              bgcolor: "primary.main",
            }}
          />
          <IconButton
            component="label"
            sx={{ position: "absolute", mt: 6, ml: -2 }}
          >
            <PhotoCamera />
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleImageUpload}
            />
          </IconButton>
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            variant="outlined"
            label="Name"
            name="name"
            margin="normal"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            name="email"
            margin="normal"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Phone Number"
            name="phone"
            margin="normal"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Save Profile
          </Button>
        </form>
      </Box>
    </ThemeProvider>
  );
};

export default Profile;
