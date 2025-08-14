import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import useFetchWithAuth from "../../hooks/useFetchWithAuth.js";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const route = id ? `/post/${id}` : null;

  const handleSuccess = useCallback((json) => {
    setPost(json);
  }, []);

  const { isLoading, error, performFetch, cancelFetch } = useFetchWithAuth(
    route,
    handleSuccess,
  );

  useEffect(() => {
    if (!route) return;

    setPost(null);
    performFetch();

    return () => {
      cancelFetch && cancelFetch();
    };
  }, [route, performFetch, cancelFetch]);

  if (isLoading && !post) return <div>Loading…</div>;
  if (error) return <div>Error: {String(error.message || error)}</div>;
  if (!post) return null;

  return (
    <div>
      <h1>{post.title}</h1>
      <div>
        by {post.author?.username || "unknown"} ·{" "}
        {post.created_at && new Date(post.created_at).toLocaleString()}
        {post.status === "PUBLISHED" && post.published_at
          ? ` · published ${new Date(post.published_at).toLocaleString()}`
          : null}
      </div>
      {post.tags?.length ? (
        <div>
          {post.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      ) : null}
      <div>{post.content}</div>
    </div>
  );
}
