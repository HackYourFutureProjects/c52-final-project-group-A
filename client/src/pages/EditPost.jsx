import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import StateContext from "../context/state/StateContext.js";
import useFetchWithAuth from "../hooks/useFetchWithAuth.js";
import EditPostForm from "../components/EditPostForm/EditPostForm.jsx";
import useSetError from "../hooks/useSetError.js";

export default function EditPostPage() {
  const { id } = useParams();
  const { state: user } = useContext(StateContext);
  const [post, setPost] = useState(null);

  // GET hook for fetching post
  const { isLoading, error, performFetch, cancelFetch } = useFetchWithAuth(
    `/post/${id}`,
    (res) => setPost(res.post ?? res),
  );

  useEffect(() => {
    setPost(null);
    performFetch();
    return () => cancelFetch();
  }, [id]);

  useSetError(error);

  // Author check
  if (!user || !user.userId) return <div>Loading user…</div>;
  if (post && post.author && post.author._id !== user.userId)
    return <div>Not authorized</div>;

  if (isLoading && !post) return <div>Loading…</div>;
  if (!post) return null;

  const showFollowBtn = user.userId === post?.author?._id;
  console.log(showFollowBtn);

  return <EditPostForm post={post} />;
}
