import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeletePostButton from "../components/DeletePostButton/DeletePostButton.jsx";

export default function SandboxPage() {
  // Delete post state
  const [deleteId, setDeleteId] = useState("");
  const [deleteResult, setDeleteResult] = useState("");

  // Go to post state
  const [goToId, setGoToId] = useState("");
  const [goError, setGoError] = useState("");
  const navigate = useNavigate();

  const isValidObjectId = (v) => /^[a-fA-F0-9]{24}$/.test(v);

  // Delete handler
  const handleDeleteSuccess = () => {
    setDeleteResult("Post deleted successfully.");
    setDeleteId("");
  };

  // Go to post handler
  const goToPost = (e) => {
    e.preventDefault();
    const id = goToId.trim();
    if (!isValidObjectId(id)) {
      setGoError("Please enter a valid 24-character Mongo ObjectId.");
      return;
    }
    setGoError("");
    navigate(`/post/${id}`);
  };

  return (
    <div>
      <h2>Sandbox</h2>

      {/* Delete post block */}
      <div>
        <h3>Delete post by ID</h3>
        <input
          type="text"
          value={deleteId}
          onChange={(e) => {
            setDeleteId(e.target.value);
            setDeleteResult("");
          }}
          placeholder="Enter post ID to delete"
        />
        <DeletePostButton postId={deleteId} onDelete={handleDeleteSuccess} />
        {deleteResult && <div>{deleteResult}</div>}
      </div>

      <hr />

      {/* Go to post block */}
      <form onSubmit={goToPost}>
        <h3>Go to post by ID</h3>
        <input
          type="text"
          value={goToId}
          onChange={(e) => setGoToId(e.target.value)}
          placeholder="Enter post ID to open"
        />
        <button type="submit">Open post</button>
        {goError && <div>{goError}</div>}
      </form>
    </div>
  );
}
