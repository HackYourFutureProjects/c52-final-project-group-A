import Comment, { validateComment } from "../models/Comment.js";
import { logInfo } from "../util/logging.js";

export default function initCommentSocket(io) {
  io.on("connection", (socket) => {
    logInfo(`WS connected: ${socket.id}`);

    // Subscribe to the post room
    socket.on("join_post", (postId) => {
      if (postId) socket.join(postId);
    });

    // New comment
    socket.on("new_comment", async ({ post, user, content }) => {
      const commentData = { post, user, content };
      const errors = validateComment(commentData);
      if (errors.length > 0) {
        return socket.emit("comment_error", { errors });
      }
      try {
        const saved = await Comment.create(commentData);
        const populated = await saved.populate("user", "username");
        io.to(post).emit("comment_added", populated);
      } catch (e) {
        socket.emit("comment_error", { message: "Failed to save comment" });
      }
    });
  });
}
