import { useContext, useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  Box,
  Paper,
  IconButton,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import {
  Send as SendIcon,
  Favorite,
  Comment,
  Share,
  Image as ImageIcon,
} from "@mui/icons-material";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { GlobalContext } from "../context/Context";
import moment from "moment";
import axios from "axios";

// Custom theme
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9", // Light blue
    },
    secondary: {
      main: "#f48fb1", // Light pink
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const Home = () => {
  const [posts, setPosts] = useState([]);
  const { state } = useContext(GlobalContext);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertType, setAlertType] = useState("");

  const db = getFirestore();

  let unsubscribe;

  const getUpdate = async () => {
    setLoading(true);
    const q = query(collection(db, "posts"), orderBy("postDate", "desc"));
    unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsArr = [];
      querySnapshot.forEach((doc) => {
        postsArr.push(doc.data());
      });
      setPosts(postsArr);
      setLoading(false);
      console.log("Connection established");
    });
  };

  useEffect(() => {
    document.title = "Home - ConnectFission";
    getUpdate();
    return () => {
      console.log("db disconnected");
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "Connectfission-posts");
      data.append("cloud_name", "diuztua2d");

      try {
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/diuztua2d/image/upload",
          data
        );
        imageUrl = res.data.url;
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    try {
      await addDoc(collection(db, "posts"), {
        userId: state?.user?.uid,
        caption: newPost,
        imageUrl: imageUrl,
        authorName: state?.user?.displayName,
        authorProfile: state?.user?.photoURL,
        postDate: Timestamp.now(),
      });
      setAlertType("success");
      setAlertMsg("Post uploaded successfully!");
      setShowAlert(true);
    } catch (e) {
      console.error("Error adding document: ", e);
      setAlertType("error");
      setAlertMsg("Failed to upload post");
      setShowAlert(true);
    }

    setNewPost("");
    setImage(null);
    setLoading(false);
  };

  const alertClose = () => {
    setShowAlert(false);
    setAlertMsg("");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}
        >
          ConnectFission
        </Typography>

        <Card sx={{ mb: 4, borderRadius: 2, bgcolor: "background.paper" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
              <Avatar sx={{ mr: 2, bgcolor: "secondary.main" }}>
                {state.user.photoURL ? (
                  <img
                    src={state.user.photoURL}
                    width={40}
                    height={40}
                    alt={state.user?.displayName.charAt(0).toUpperCase()}
                  />
                ) : (
                  state.user?.displayName.charAt(0).toUpperCase()
                )}
              </Avatar>
              <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="What's on your mind?"
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <Box sx={{ display: "flex" }}>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<ImageIcon />}
                  sx={{ mr: 2 }}
                >
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  disabled={!newPost.trim() && !image}
                >
                  Post
                </Button>
                  </Box>
               
              </form>
            </Box>
          </CardContent>
        </Card>

        {!loading ? (
          <Grid container spacing={4}>
            {posts.map((post, id) => (
              <Grid item xs={12} key={id}>
                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "background.paper" }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
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
                  <Typography
                    variant="body1"
                    sx={{ color: "#B0BEC5", fontWeight: "bold" }}
                    paragraph
                  >
                    {post.caption}
                  </Typography>
                  {post.imageUrl && (
                    <Box sx={{ my: 2 }}>
                      <img
                        src={post.imageUrl}
                        alt="Post"
                        style={{ width: "60%", borderRadius: "10px" }}
                      />
                    </Box>
                  )}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="caption" sx={{ color: "gray" }}>
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
            <CircularProgress size={45} color="primary" />
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Home;
