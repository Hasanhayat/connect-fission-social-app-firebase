import { Box, Typography } from "@mui/material"

const DemoPosts = ({ title = "Posts" }) => {
  const posts = [
    {
      id: 1,
      author: "Hassan hayat",
      content:
        "Just finished an amazing project using React and Firebase. The possibilities are endless! #WebDev #ReactJS",
      time: "2 hours ago",
      likes: 15,
      comments: 3,
    },
    {
      id: 2,
      author: "Jane Smith",
      content:
        "Excited to join the ConnectFission community! Looking forward to sharing ideas and collaborating with fellow developers. 🚀",
      time: "1 day ago",
      likes: 32,
      comments: 7,
    },
    {
      id: 3,
      author: "Alex Johnson",
      content:
        "Just launched my portfolio website built with Next.js and styled with Tailwind CSS. Check it out and let me know what you think! #WebDevelopment #NextJS",
      time: "3 days ago",
      likes: 48,
      comments: 12,
    },
  ]

  return (
    <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6" sx={{ color: "#B0BEC5", mb: 2 }}>
        {title}
      </Typography>

      {posts.map((post) => (
        <Box
          key={post.id}
          sx={{
            bgcolor: "#1E1E1E",
            p: 2,
            borderRadius: 2,
            border: "1px solid #333",
          }}
        >
          <Typography variant="subtitle1" sx={{ color: "#90CAF9", fontWeight: "bold", mb: 1 }}>
            {post.author}
          </Typography>
          <Typography variant="body2" sx={{ color: "#B0BEC5", mb: 2 }}>
            {post.content}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", color: "#757575" }}>
            <Typography variant="caption">{post.time}</Typography>
            <Typography variant="caption">
              {post.likes} likes • {post.comments} comments
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

export default DemoPosts

