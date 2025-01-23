import React, { useState } from "react";
import {
  Box,
  Button,
  Avatar,
  TextField,
  Typography,
  CssBaseline,
  IconButton,
  Modal,
  Tooltip,
  ThemeProvider,
  createTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import { Edit, Delete, Verified } from "@mui/icons-material";
import {
  getAuth,
  sendEmailVerification,
  updateEmail,
  updateProfile,
  deleteUser,
} from "firebase/auth";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#90caf9" },
    background: { default: "#121212", paper: "#1e1e1e" },
    text: { primary: "#ffffff", secondary: "#b0bec5" },
  },
});

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [profileImage, setProfileImage] = useState(
    user?.photoURL || "/src/assets/profileImg.png"
  );
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isEmailVerified, setIsEmailVerified] = useState(
    user?.emailVerified || false
  );
  const [openModal, setOpenModal] = useState(false);
  const [editField, setEditField] = useState("");

  // Modal Handler
  const handleOpenModal = (field) => {
    setEditField(field);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setEditField("");
    setOpenModal(false);
  };

  // Update Profile
  const handleUpdateProfile = () => {
    updateProfile(auth.currentUser, { displayName, photoURL: profileImage })
      .then(() => {
        setAlertMsg("Profile updated successfully");
        setShowAlert(true);
      })
      .catch((error) => alert(error.message));
  };

  // Update Email
  const handleUpdateEmail = () => {
    updateEmail(auth.currentUser, email)
      .then(() => {
        setAlertMsg("Email updated successfully");
        setShowAlert(true);
      })
      .catch((error) => alert(error.message));
  };

  // Send Email Verification
  const handleSendVerification = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setAlertMsg("Verification email sent");
        setShowAlert(true);
      })
      .catch((error) => alert(error.message));
  };

  // Delete Account
  const handleDeleteAccount = () => {
    deleteUser(auth.currentUser)
      .then(() => {
        setAlertMsg("Account deleted successfully");
        setShowAlert(true);
      })
      .catch((error) => alert(error.message));
  };
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(false);

  const alertClose = () => {
    setShowAlert(false);
  };
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
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertMsg}
        </Alert>
      </Snackbar>
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
          Profile
        </Typography>
        <Box display="flex" justifyContent="center" mb={3}>
          <Avatar
            src={profileImage}
            sx={{ width: 80, height: 80, bgcolor: "primary.main" }}
          />
          <Tooltip title="Edit Profile Picture">
            <IconButton
              sx={{ position: "absolute", mt: 6, ml: -2 }}
              component="label"
            >
              <Edit />
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => setProfileImage(reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Profile Info */}
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            <b> Name:</b> {displayName || "Not set"}
          </Typography>
          <IconButton onClick={() => handleOpenModal("name")}>
            <Edit />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            <b>Email:</b> {email}
          </Typography>
          {!isEmailVerified && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleSendVerification}
            >
              Verify
            </Button>
          )}
          <IconButton onClick={() => handleOpenModal("email")}>
            <Edit />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            {isEmailVerified ? <b>Email Verified</b> : <b>not verified</b>}
          </Typography>
          {isEmailVerified && <Verified color="success" />}
        </Box>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={handleDeleteAccount}
          sx={{ mt: 2 }}
        >
          Delete Account
        </Button>

        {/* Modal for Editing */}
        <Modal open={openModal} onClose={handleCloseModal}>
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
              Edit {editField === "name" ? "Name" : "Email"}
            </Typography>
            <TextField
              fullWidth
              value={editField === "name" ? displayName : email}
              onChange={(e) =>
                editField === "name"
                  ? setDisplayName(e.target.value)
                  : setEmail(e.target.value)
              }
              label={editField === "name" ? "Name" : "Email"}
              variant="outlined"
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                editField === "name"
                  ? handleUpdateProfile()
                  : handleUpdateEmail();
                handleCloseModal();
              }}
            >
              Save
            </Button>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
};

export default Profile;
