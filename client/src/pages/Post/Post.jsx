import { useEffect, useState } from "react";
import CommentSection from "../../components/CommentSection/CommentSection.jsx";

const API = import.meta.env.VITE_BACKEND_URL;
const TEST_POST_ID = "688ca9cbcc799a751a915931"; // temporary as for the playground

export default function Post() {
  const [post, setPost] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = "688ca9c1cc799a751a91589a"; // temporary as for the playground

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/post/${TEST_POST_ID}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load post");
        const p = await res.json();
        setPost(p);
      })
      .catch((e) => setErr(e.message || "Error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading…</div>;
  if (err) return <div style={{ color: "crimson" }}>{err}</div>;
  if (!post) return <div>No post found</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Post Playground</h2>
      <div style={{ marginBottom: 16 }}>
        <div>
          <strong>Post ID:</strong> {post._id}
        </div>
        {post.title && (
          <div>
            <strong>Title:</strong> {post.title}
          </div>
        )}
      </div>

      <CommentSection postId={post._id} userId={userId} />
    </div>
  );
}
