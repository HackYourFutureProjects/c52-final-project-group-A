import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../../context/user/UserContext.js";
import useFetch from "../../hooks/useFetch";
import EditPostForm from "../../components/EditPostForm/EditPostForm.jsx";
import ProfileDash from "../../components/ProfileDash/ProfileDash.jsx";
import style from "./EditPost.module.css";

export default function EditPostPage() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  // GET hook for fetching post
  const { performFetch: fetchPost, cancelFetch } = useFetch(
    `/post/${id}`,
    (res) => setPost(res.post ?? res),
  );

  // PATCH hook for updating post
  const { performFetch: updatePost } = useFetch(`/post/${id}`, (res) => {
    if (res.success) navigate(`/post/${id}`); // redirect to post page after save
  });

  useEffect(() => {
    setPost(null);
    fetchPost();
    return () => cancelFetch();
  }, [id]);

  const handleSave = (fields) => {
    // eslint-disable-next-line no-unused-vars
    const { _id, __v, ...fieldsToSend } = fields;

    updatePost({
      method: "PATCH",
      body: JSON.stringify(fieldsToSend),
      headers: { "Content-Type": "application/json" },
    });
  };

  // Author check
  if (post && post.author && post.author._id !== user.userId)
    return <div>Not authorized</div>;

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
          onSave={handleSave}
          onCancel={() => navigate(`/post/${id}`)}
        />
      </div>
    </main>
  );
}
