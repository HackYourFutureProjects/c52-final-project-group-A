import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import useFetchWithAuth from "../../hooks/useFetchWithAuth.js";
import Post from "../../components/Post/Post.jsx";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  const handleSuccess = useCallback((json) => {
    setPost(json);
  }, []);

  const { isLoading, error, performFetch, cancelFetch } = useFetchWithAuth(
    `/post/${id}`,
    handleSuccess,
  );

  useEffect(() => {
    setPost(null);
    performFetch();

    return () => {
      cancelFetch && cancelFetch();
    };
  }, [id]);

  // Like switcher function
  const handleLikeToggle = async () => {
    if (!post) return;
    const res = await fetch(`/api/posts/${post._id}/like`, {
      method: "POST",
      credentials: "include",
    });
    const data = await res.json();
    setPost((prev) => ({ ...prev, likedByCurrentUser: data.liked }));
  };

  if (isLoading && !post) return <div>Loading…</div>;
  if (error) return <div>Error: {String(error.message || error)}</div>;
  if (!post) return null;

  return (
    <Post
      post={post}
      liked={post.likedByCurrentUser}
      onLikeToggle={handleLikeToggle}
    />
  );
}
