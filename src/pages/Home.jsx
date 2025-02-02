import { useContext, useState } from "react"
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
  const db = getFirestore();

  const { state, dispatch, logout } = useContext(GlobalContext);
  const [newPost, setNewPost] = useState("")
  const [posts, setPosts] = useState([
    { id: 1, author: "Alice", content: "Just finished a great book! 📚", likes: 15 },
    { id: 2, author: "Bob", content: "Check out this amazing sunset! 🌅", likes: 32 },
    { id: 3, author: "Charlie", content: "New personal best in my marathon training! 🏃‍♂️", likes: 24 },
  ])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newPost.trim()) return
    const newPostObj = {
      id: posts.length + 1,
      author: state.user.displayName,
      content: newPost,
      likes: 0,
    }
    setPosts([newPostObj, ...posts])
    setNewPost("")
  }

  const handleLike = (id) => {
    setPosts(posts.map((post) => (post.id === id ? { ...post, likes: post.likes + 1 } : post)))
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: "bold", color: "primary.main" }}>
          ConnectFission
        </Typography>

        <Card sx={{ mb: 4, borderRadius: 2, bgcolor: "background.paper" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
              <Avatar sx={{ mr: 2, bgcolor: "secondary.main" }}>Y</Avatar>
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
          {posts.map((post) => (
            <Grid item xs={12} key={post.id}>
              <Paper sx={{ p: 3, borderRadius: 2, bgcolor: "background.paper" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>{post.author[0]}</Avatar>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {post.author}
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  {post.content}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    {post.likes} likes
                  </Typography>
                  <Box>
                    <IconButton onClick={() => handleLike(post.id)} color="primary">
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

