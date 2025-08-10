// This is temporary sandbox page to test post and comment functionality by the adres:
// http://localhost:5173/__dev/post

import PostItem from "../components/PostItem/PostItem.jsx";

export default function DevPostPlayground() {
  const post = {
    _id: "68948a04d6f9d84248751d11",
    title: "Test Post for Comments",
    content: "<p>This is a test post so we can check WebSocket comments.</p>",
  };

  const currentUser = {
    username: "DevTester",
    avatar: "https://via.placeholder.com/40",
  };

  return (
    <div style={{ padding: "2rem" }}>
      <PostItem post={post} currentUser={currentUser} />
    </div>
  );
}
