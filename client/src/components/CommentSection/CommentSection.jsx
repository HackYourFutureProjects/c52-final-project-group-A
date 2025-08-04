import { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { socket, on } from "../../util/socket";

const API = import.meta.env.VITE_BACKEND_URL;

export default function CommentSection({ postId, userId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const idsRef = useRef(new Set());

  // auxiliary addComment without duplicates
  const addComment = (c) => {
    const id = c._id || c.id;
    if (!id || idsRef.current.has(id)) return;
    idsRef.current.add(id);
    setComments((prev) => [...prev, c]);
  };

  // Initial loading of existing comments
  useEffect(() => {
    if (!postId) return;
    setLoading(true);
    setErr("");
    idsRef.current.clear();

    const ctrl = new AbortController();
    fetch(`${API}/api/posts/${postId}/comments`, { signal: ctrl.signal })
      .then(async (r) => {
        if (!r.ok) throw new Error(`Failed to load comments: ${r.status}`);
        const list = await r.json();
        const nextIds = new Set(list.map((c) => c._id || c.id).filter(Boolean));
        idsRef.current = nextIds;
        setComments(list);
      })
      .catch((e) => {
        if (e.name !== "AbortError")
          setErr(e.message || "Failed to load comments");
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [postId]);

  // Subscribe to a post room and receive new comments
  useEffect(() => {
    if (!postId) return;
    socket.emit("join_post", postId);

    const off = on("comment_added", (comment) => {
      addComment(comment);
    });

    return () => off();
  }, [postId]);

  // Submit a comment
  const send = () => {
    const content = text.trim();
    if (!content) return;
    socket.emit("new_comment", { post: postId, user: userId, content });
    setText("");
  };

  // Sort by date
  const sorted = useMemo(
    () =>
      [...comments].sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      ),
    [comments],
  );

  return (
    <div>
      <h3>Comments</h3>

      {loading && <div>Loading…</div>}
      {err && <div style={{ color: "crimson" }}>{err}</div>}

      {!loading && sorted.length === 0 && <div>No comments yet</div>}

      <div style={{ display: "grid", gap: 8, marginBottom: 8 }}>
        {sorted.map((c) => (
          <div key={c._id || c.id}>
            <strong>{c.user?.username ?? "user"}</strong>: {c.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment…"
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send} disabled={!text.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}

CommentSection.propTypes = {
  postId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};
