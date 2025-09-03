import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import EditPostForm from "../components/EditPostForm/EditPostForm.jsx";
import UserContext from "../context/user/UserContext.js";
import useFetch from "../hooks/useFetch.js";

export default function EditPostPage() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [post, setPost] = useState(null);

  // GET hook for fetching post
  const { performFetch, cancelFetch } = useFetch(
    `/post/${id}`,
    (res) => setPost(res.post ?? res),
  );

  useEffect(() => {
    setPost(null);
    performFetch();
    return () => cancelFetch();
  }, [id]);

  // Author check
  if (!user || !user.userId) return <div>Loading user…</div>;
  if (post && post.author && post.author._id !== user.userId)
    return <div>Not authorized</div>;

  if (!post) return null;

  return <EditPostForm post={post} />;
}
