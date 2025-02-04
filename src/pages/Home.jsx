import { useContext, useEffect, useState } from "react"
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
} from "@mui/material"
import { Send as SendIcon, Favorite, Comment, Share } from "@mui/icons-material"
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { GlobalContext } from "../context/Context";




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
})

const Home = () => {

  const [posts, setPosts] = useState([])
  const { state, dispatch, logout } = useContext(GlobalContext);
  const [newPost, setNewPost] = useState("")

  const getAllData = async() => {
    setPosts([])
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} =>`, doc.data());
      setPosts((prev) => [...prev, doc.data()])
    });
  }
  useEffect(() => {
    console.log(state)
    document.title = "Home - ConnectFission";
    getAllData();
  } , []);

  const db = getFirestore();


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        userId: state?.user?.uid,
        caption: newPost,
        authorName: state?.user?.displayName,
        authorProfile: state?.user?.photoURL,
        postDate: new Date()
      });
      setAlertType("success");
      setAlertMsg("posted");
      setShowAlert(true);
      getAllData();
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setNewPost("")
  }

  // const handleLike = (id) => {
  //   setPosts(posts.map((post) => (post.id === id ? { ...post, likes: post.likes + 1 } : post)))
  // }

  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(false);
  const [alertType, setAlertType] = useState("");

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
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
          ConnectFission
        </Typography>

        <Card sx={{ mb: 4, borderRadius: 2, bgcolor: "background.paper" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
              <Avatar sx={{ mr: 2, bgcolor: "secondary.main" }}><img src={state?.user?.photoURL} width={40} height={40} alt="CF" /></Avatar>
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
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  disabled={!newPost.trim()}
                >
                  Post
                </Button>
              </form>
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={4}>
          {posts.map((post, id) => (
            <Grid item xs={12} key={id}>
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "background.paper" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}><img src={post.authorProfile} width={40} height={40} alt="profile" /></Avatar>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {post.authorName}
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  {post.caption}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    {/* {post.likes} likes */}
                  </Typography>
                  <Box>
                    <IconButton onClick={() => handleLike(post.userId)} color="primary">
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
      </Container>
    </ThemeProvider>
  )
}

export default Home

