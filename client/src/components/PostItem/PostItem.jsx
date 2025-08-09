import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import CommentItem from "@/components/CommentItem/CommentItem.jsx";
import styles from "./postItem.module.css";

export default function PostItem({ post, currentUser }) {
  const apiBase = import.meta.env.VITE_BACKEND_URL;
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const postingRef = useRef(false);

  useEffect(() => {
    if (!post?._id) return;
    setLoadingComments(true);
    (async () => {
      try {
        const res = await fetch(`${apiBase}/api/comments?post=${post._id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load comments");
        const data = await res.json();
        setComments(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoadingComments(false);
      }
    })();
  }, [post?._id, apiBase]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (postingRef.current) return;
    const content = text.trim();
    if (!content) return;

    const tempId = "temp-" + Date.now();
    const optimistic = {
      _id: tempId,
      content,
      created_at: new Date().toISOString(),
      user: {
        username: currentUser?.username || "You",
        avatar: currentUser?.avatar || "",
      },
    };
    setComments((prev) => [optimistic, ...prev]);
    setText("");

    postingRef.current = true;
    try {
      const res = await fetch(`${apiBase}/api/comments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post: post._id, content }),
      });
      if (!res.ok) throw new Error("Failed to send comment");
      const saved = await res.json();
      setComments((prev) => prev.map((c) => (c._id === tempId ? saved : c)));
    } catch (e) {
      setComments((prev) => prev.filter((c) => c._id !== tempId));
      setError(e.message);
    } finally {
      postingRef.current = false;
    }
  }

  return (
    <article className={styles.post}>
      <h1 className={styles.title}>{post.title}</h1>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />

      <section className={styles.commentsBlock} aria-label="Comments">
        <h2 className={styles.commentsTitle}>Comments</h2>

        {currentUser && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <textarea
              className={styles.textarea}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment…"
              rows={3}
              aria-label="Comment text"
            />
            <button
              className={styles.button}
              type="submit"
              disabled={!text.trim() || loadingComments}
            >
              Send
            </button>
          </form>
        )}

        {error && <div className={styles.error}>{error}</div>}

        {loadingComments ? (
          <div className={styles.muted}>Loading…</div>
        ) : comments.length ? (
          comments.map((c) => <CommentItem key={c._id} comment={c} />)
        ) : (
          <div className={styles.muted}>No comments yet.</div>
        )}
      </section>
    </article>
  );
}

PostItem.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({
    username: PropTypes.string,
    avatar: PropTypes.string,
  }),
};
