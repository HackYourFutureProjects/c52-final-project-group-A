export function registerCommentsSocket(io) {
  const nsp = io.of("/comments");

  nsp.on("connection", (socket) => {
    socket.on("comments:join", ({ postId }) => {
      if (!postId) return;
      socket.join(roomName(postId));
    });

    socket.on("comments:leave", ({ postId }) => {
      if (!postId) return;
      socket.leave(roomName(postId));
    });
  });
}

export function roomName(postId) {
  return `post:${postId}`;
}
