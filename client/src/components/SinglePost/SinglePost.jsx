import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import styles from "./SinglePost.module.css";

const SinglePost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    `/post/${id}`,
    (data) => {
      setPost(data);
    },
  );

  useEffect(() => {
    performFetch();

    return () => {
      cancelFetch();
    };
  }, [id]);

  useEffect(() => {
    if (error) {
      try {
        const maybePost = JSON.parse(
          error.toString().replace(/^.*Received:\s*/, ""),
        );
        if (maybePost && maybePost._id && maybePost.title) {
          setPost(maybePost);
        }
      } catch {
        // ignore parsing errors — not a valid JSON post
      }
    }
  }, [error]);

  if (isLoading) return <p>Loading...</p>;
  if (!post && error) return <p>{error.toString()}</p>;
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
