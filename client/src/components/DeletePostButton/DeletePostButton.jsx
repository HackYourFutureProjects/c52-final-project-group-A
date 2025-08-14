import { useState } from "react";
import PropTypes from "prop-types";
import Button from "../Button.jsx";

function DeletePostButton({ postId, onDelete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!window.confirm("Delete post?")) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/post/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error during deletion");
      if (onDelete) onDelete();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        label={loading ? "Deleting..." : "Delete"}
        onClick={handleDelete}
        disabled={loading || !postId}
      />
      {error && <div>{error}</div>}
    </>
  );
}

DeletePostButton.propTypes = {
  postId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default DeletePostButton;
