import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./SinglePost.module.css";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/post/${id}`,
        );
        setPost(res.data);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Error loading post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className={styles.wrapper}>
      <div className="single-post">
        <h1>{post.title}</h1>
        <p>
          <strong>Author:</strong> {post.author?.username ?? "—"}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(post.created_at).toLocaleDateString()}
        </p>
        <p>
          <strong>Score:</strong> {post.score}
        </p>
        <p>
          <strong>Tags:</strong>{" "}
          {Array.isArray(post.tags) ? post.tags.join(", ") : "—"}
        </p>
        <div className="content">{post.content}</div>
      </div>
    </div>
  );
};

export default SinglePost;
