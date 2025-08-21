import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StateContext from "../../context/state/StateContext.js";
import useFetchWithAuth from "../../hooks/useFetchWithAuth";
import EditPostForm from "../../components/EditPostForm/EditPostForm.jsx";
import ProfileDash from "../../components/ProfileDash/ProfileDash.jsx";
import style from "./EditPost.module.css";

export default function EditPostPage() {
  const { id } = useParams();
  const { state: user } = useContext(StateContext);
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // GET hook for fetching post
  const {
    isLoading,
    error: fetchError,
    performFetch: fetchPost,
    cancelFetch,
  } = useFetchWithAuth(`/post/${id}`, (res) => setPost(res.post ?? res));

  // PATCH hook for updating post
  const { performFetch: updatePost } = useFetchWithAuth(
    `/post/${id}`,
    (res) => {
      console.log("PATCH response:", res);
      if (res.success) navigate(`/post/${id}`); // redirect to post page after save
    },
  );

  useEffect(() => {
    setPost(null);
    fetchPost();
    return () => cancelFetch && cancelFetch();
  }, [id]);

  const handleSave = (fields) => {
    setError("");

    // eslint-disable-next-line no-unused-vars
    const { _id, __v, ...fieldsToSend } = fields;

    updatePost({
      method: "PATCH",
      body: JSON.stringify(fieldsToSend),
      headers: { "Content-Type": "application/json" },
    });
  };

  // Author check
  if (!user || !user.userId) return <div>Loading user…</div>;
  if (post && post.author && post.author._id !== user.userId)
    return <div>Not authorized</div>;

  if (isLoading && !post) return <div>Loading…</div>;
  if (fetchError)
    return <div>Error: {String(fetchError.message || fetchError)}</div>;
  if (!post) return null;

  const showFollowBtn = user.userId !== post?.author?._id;

  return (
    <main className={style.main}>
      <ProfileDash
        size="md"
        user={post.author}
        className={style.dashboard}
        followBtn={!showFollowBtn}
      />
      <div className={style.postContainer}>
        <EditPostForm
          post={post}
          error={error}
          onSave={handleSave}
          onCancel={() => navigate(`/post/${id}`)}
        />
      </div>
    </main>
  );
}
