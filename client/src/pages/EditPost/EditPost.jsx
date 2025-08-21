import { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StateContext from "../../context/state/StateContext.js";
import useFetchWithAuth from "../../hooks/useFetchWithAuth";
import EditPostForm from "../../components/EditPostForm/EditPostForm.jsx";

export default function EditPostPage() {
  const { id } = useParams();
  const { state } = useContext(StateContext);
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Get post
  const handleGetSuccess = useCallback((json) => {
    setPost(json);
  }, []);

  const {
    isLoading,
    error: fetchError,
    performFetch,
  } = useFetchWithAuth(`/post/${id}`, handleGetSuccess);

  useEffect(() => {
    performFetch();
  }, [id]);

  // PATCH (call from EditPostForm)
  const handleSave = (fields) => {
    setError("");
    performFetch({
      method: "PATCH",
      body: fields,
      onSuccess: (json) => {
        if (json.success) {
          navigate(`/post/${id}`);
        } else {
          setError(json.msg || "Unknown error");
        }
      },
    });
  };

  // Author check
  const authorId = post?.author?._id || post?.author;
  if (post && state.userId && String(authorId) !== String(state.userId)) {
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
        onCancel={() => navigate(`/post/${id}`)}
      />
    </main>
  );
}
