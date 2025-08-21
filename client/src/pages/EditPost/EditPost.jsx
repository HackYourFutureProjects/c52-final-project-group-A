import { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StateContext from "../../context/state/StateContext.js";
import useFetchWithAuth from "../../hooks/useFetchWithAuth";
import EditPostForm from "../../components/EditPostForm/EditPostForm.jsx";

export default function EditPostPage() {
  const { id } = useParams();
  const { state: user } = useContext(StateContext);
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // GET post
  const handleGetSuccess = useCallback((json) => {
    setPost(json);
  }, []);

  const {
    isLoading,
    error: fetchError,
    performFetch,
  } = useFetchWithAuth(`/post/${id}`, handleGetSuccess);

  // PATCH to update Post
  const { performFetch: performPatch } = useFetchWithAuth(
    `/post/${id}`,
    (json) => {
      if (json.success) {
        navigate(`/post/${id}`);
      } else {
        setError(json.msg || "Unknown error");
      }
    },
  );

  useEffect(() => {
    performFetch();
  }, [id]);

  // PATCH from EditPostForm
  const handleSave = (fields) => {
    setError("");

    // eslint-disable-next-line no-unused-vars
    const { _id, __v, ...fieldsToSend } = fields;

    performPatch({
      method: "PATCH",
      body: JSON.stringify(fieldsToSend),
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  // Author check
  if (!user || !user.userId) {
    return <div>Loading user…</div>;
  }
  if (post && post.author && user && post.author._id !== user.userId) {
    return <div>Not authorized</div>;
  }
  if (isLoading && !post) return <div>Loading…</div>;
  if (fetchError)
    return <div>Error: {String(fetchError.message || fetchError)}</div>;
  if (!post) return null;

  return (
    <main>
      <h2>Edit Post</h2>
      <EditPostForm
        post={post}
        error={error}
        onSave={handleSave}
        onCancel={() => navigate(`/home`)}
      />
    </main>
  );
}
