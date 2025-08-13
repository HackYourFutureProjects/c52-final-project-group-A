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
  }, [id]);

  if (isLoading) return <div className="p-4">Loading…</div>;
    return () => cancelFetch();
  }, [route, performFetch]);
  if (isLoading && !post) return <div className="p-4">Loading…</div>;
  if (error)
    return (
      <div className="p-4 text-red-600">
        Error: {String(error.message || error)}
      </div>
    );
  if (!post) return null;

  return (
    <div className="p-4 max-w-3xl space-y-3">
      <h1 className="text-2xl font-semibold">{post.title}</h1>
      <div className="text-sm text-gray-600">
        by {post.author?.username || "unknown"} ·{" "}
        {post.created_at && new Date(post.created_at).toLocaleString()}
        {post.status === "PUBLISHED" && post.published_at
          ? ` · published ${new Date(post.published_at).toLocaleString()}`
          : null}
      </div>
      {post.tags?.length ? (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="px-2 py-1 text-xs border rounded">
              {t}
            </span>
          ))}
        </div>
      ) : null}
      <div className="whitespace-pre-wrap">{post.content}</div>
    </div>
  );
}
