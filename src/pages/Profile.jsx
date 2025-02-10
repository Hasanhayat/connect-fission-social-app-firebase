import React, { useEffect, useState } from "react";
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
  CircularProgress,
  Grid,
  Paper,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Comment,
  Edit,
  Favorite,
  MoreVert,
  Share,
  Verified,
} from "@mui/icons-material";
import {
  getAuth,
  sendEmailVerification,
  updateEmail,
  updateProfile,
  deleteUser,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import axios from "axios";
import {
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import moment from "moment";
import Swal from "sweetalert2";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00bcd4" },
    secondary: { main: "#ff4081" },
    background: { default: "#0d1117", paper: "#161b22" },
    text: { primary: "#e6edf3", secondary: "#8b949e" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600 },
    body1: { fontSize: "1rem" },
  },
});

const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [profileImage, setProfileImage] = useState(user?.photoURL || "");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(
    user?.emailVerified || false
  );
  const [openModal, setOpenModal] = useState(false);
  const [editField, setEditField] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentCaption, setCurrentCaption] = useState("");

  const db = getFirestore();

  let unsubscribe;
  const getUpdate = async () => {
    setLoading(true);
    const q = query(collection(db, "posts"), where("userId", "==", user.uid));
    unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsArr = [];
      querySnapshot.forEach((doc) => {
        postsArr.push({ ...doc.data(), id: doc.id });
      });
      setPosts(postsArr);
      setLoading(false);
    });
  };

  useEffect(() => {
    document.title = `${user.displayName} - Profile`;
    getUpdate();
    return () => {
      unsubscribe();
    };
  }, []);

  const alertClose = () => setShowAlert(false);
  const handleOpenModal = (field) => {
    if (field === "post") {
      handleMenuClose();
      setCurrentCaption(selectedPost.caption);
    }
    setEditField(field);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setEditField("");
    setOpenModal(false);
  };

  const handleMenuOpen = (event, post) => {
    setAnchorEl(event.currentTarget);
    setSelectedPost(post);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const deletePost = () => {
    handleMenuClose();
    Swal.fire({
      title: "Do you want delete this post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        const del = async () => {
          await deleteDoc(doc(db, "posts", selectedPost.id));
          setSelectedPost(null);
          setAlertMsg("Post deleted successfully");
          setAlertType("success");
          setShowAlert(true);
        };
        del();
        // Swal.fire("deleted!", "", "success");
      }
    });
  };
  const editPost = async () => {
    handleMenuClose();
    await updateDoc(doc(db, "posts", selectedPost.id), {
      caption: currentCaption,
    });
    setCurrentCaption("");
    setSelectedPost(null);
    setAlertMsg("Post updated successfully");
    setAlertType("success");
    setShowAlert(true);
  };

  const handleUpdateProfile = () => {
    updateProfile(auth.currentUser, { displayName, photoURL: profileImage })
      .then(() => {
        setAlertMsg("Profile updated successfully");
        setAlertType("success");
        setShowAlert(true);
      })
      .catch((error) => {
        setAlertMsg(error.message);
        setAlertType("error");
        setShowAlert(true);
      });
  };

  const handleUpdatePassword = () => {
    if (password.length < 8) {
      setAlertMsg("Password must be at least 8 characters long");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    const credential = EmailAuthProvider.credential(user.email, password);
    reauthenticateWithCredential(user, credential)
      .then(() => updatePassword(user, password))
      .then(() => {
        setAlertMsg("Password updated successfully");
        setAlertType("success");
        setShowAlert(true);
      })
      .catch((error) => {
        setAlertMsg(error.message);
        setAlertType("error");
        setShowAlert(true);
      });
  };

  const handleUpdateEmail = () => {
    updateEmail(auth.currentUser, email)
      .then(() => {
        setAlertMsg("Email updated successfully");
        setAlertType("success");
        setShowAlert(true);
      })
      .catch((error) => {
        setAlertMsg(error.message);
        setAlertType("error");
        setShowAlert(true);
      });
  };

  const handleSendVerification = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setAlertMsg("Verification email sent");
        setAlertType("success");
        setShowAlert(true);
      })
      .catch((error) => {
        setAlertMsg(error.message);
        setAlertType("error");
        setShowAlert(true);
      });
  };

  const handleDeleteAccount = () => {
    deleteUser(auth.currentUser)
      .then(() => {
        setAlertMsg("Account deleted successfully");
        setAlertType("success");
        setShowAlert(true);
      })
      .catch((error) => {
        setAlertMsg(error.message);
        setAlertType("error");
        setShowAlert(true);
      });
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Snackbar
        open={showAlert}
        autoHideDuration={2000}
        onClose={alertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
          maxWidth: 500,
          mx: "auto",
          mt: 4,
          p: 4,
          boxShadow: 5,
          borderRadius: 4,
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Profile
        </Typography>
        <Box display="flex" justifyContent="center" mb={3} position="relative">
          <Avatar
            src={profileImage}
            sx={{
              width: 100,
              height: 100,
              border: "3px solid",
              borderColor: "primary.main",
            }}
          />
          <Tooltip title="Edit Profile Picture">
            <IconButton
              sx={{
                position: "absolute",
                bottom: 0,
                right: "calc(50% - 50px)",
                bgcolor: "primary.main",
                color: "#fff",
              }}
              component="label"
            >
              <Edit />
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  const data = new FormData();
                  data.append("file", file);
                  data.append("upload_preset", "Connectfission-profile");
                  data.append("cloud_name", "diuztua2d");
                  try {
                    const result = await axios.post(
                      "https://api.cloudinary.com/v1_1/diuztua2d/image/upload",
                      data
                    );
                    const img = result.data.secure_url.replace(
                      "/upload/",
                      "/upload/c_thumb,w_200,h_200/"
                    );
                    setProfileImage(img);
                    handleOpenModal("image");
                  } catch (err) {
                    console.log(err);
                  }
                }}
              />
            </IconButton>
          </Tooltip>
        </Box>

        {["Name", "Email", "Password"].map((field, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            mb={2}
            sx={{ borderBottom: "1px solid #333", pb: 1 }}
          >
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              <b>{field}:</b>{" "}
              {field === "Password"
                ? "●●●●●●●●●"
                : field === "Name"
                ? displayName || "Not set"
                : email}
            </Typography>
            <IconButton onClick={() => handleOpenModal(field.toLowerCase())}>
              <Edit />
            </IconButton>
          </Box>
        ))}

        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="body1" sx={{ flexGrow: 1 }}>
            {isEmailVerified ? <b>Email Verified</b> : <b>Not Verified</b>}
          </Typography>
          {isEmailVerified && <Verified color="success" />}
          {!isEmailVerified && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={handleSendVerification}
              sx={{ ml: 2 }}
            >
              Verify
            </Button>
          )}
        </Box>

        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={handleDeleteAccount}
          sx={{ mt: 2 }}
        >
          Delete Account
        </Button>

        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              width: 300,
              mx: "auto",
              mt: "20vh",
              p: 3,
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" gutterBottom>
              {editField === "image"
                ? "Save Image"
                : editField === "post"
                ? "Edit post"
                : `Edit ${
                    editField.charAt(0).toUpperCase() + editField.slice(1)
                  }`}
            </Typography>
            {editField !== "image" && (
              <TextField
                fullWidth
                type={editField === "password" ? "password" : "text"}
                value={
                  editField === "name"
                    ? displayName
                    : editField === "post"
                    ? currentCaption
                    : editField === "password"
                    ? password
                    : email
                }
                onChange={(e) => {
                  if (editField === "name") setDisplayName(e.target.value);
                  else if (editField === "password")
                    setPassword(e.target.value);
                  else if (editField === "post")
                    setCurrentCaption(e.target.value);
                  else setEmail(e.target.value);
                }}
                label={editField.charAt(0).toUpperCase() + editField.slice(1)}
                variant="outlined"
                margin="normal"
              />
            )}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                if (editField === "password" && password.length < 8) {
                  setAlertMsg("Password must be at least 8 characters long");
                  setAlertType("error");
                  setShowAlert(true);
                  return;
                }
                if (editField === "name" || editField === "image")
                  handleUpdateProfile();
                else if (editField === "password") handleUpdatePassword();
                else if (editField === "post") editPost();
                else handleUpdateEmail();
                handleCloseModal();
              }}
              sx={{ mt: 2 }}
            >
              Save
            </Button>
          </Box>
        </Modal>
      </Box>

      {!loading ? (
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
          {posts.map((post, id) => (
            <Grid item xs={12} md={6} key={id}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  boxShadow: 5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                      {post.authorProfile ? (
                        <img
                          src={post.authorProfile}
                          width={40}
                          height={40}
                          alt={post.authorName?.charAt(0).toUpperCase()}
                        />
                      ) : (
                        post.authorName?.charAt(0).toUpperCase()
                      )}
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {post.authorName}
                    </Typography>
                  </Box>
                  <IconButton onClick={(e) => handleMenuOpen(e, post)}>
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl && selectedPost?.id === post.id)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                  >
                    <MenuItem
                      onClick={() => {
                        handleOpenModal("post");
                      }}
                    >
                      Edit Post
                    </MenuItem>
                    <MenuItem onClick={deletePost}>Delete Post</MenuItem>
                  </Menu>
                </Box>
                <Typography
                  variant="body1"
                  sx={{ color: "text.secondary", fontWeight: "bold" }}
                  paragraph
                >
                  {post.caption}
                </Typography>
                {post.imageUrl && (
                  <Box sx={{ my: 2 }}>
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      style={{ width: "100%", borderRadius: "10px" }}
                    />
                  </Box>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {moment(post.postDate.toDate()).fromNow()}
                  </Typography>
                  <Box>
                    <IconButton color="primary">
                      <Favorite />
                    </IconButton>
                    <IconButton color="primary">
                      <Comment />
                    </IconButton>
                    <IconButton color="primary">
                      <Share />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress size={50} color="primary" />
        </Box>
      )}
    </ThemeProvider>
  );
};

export default Profile;
