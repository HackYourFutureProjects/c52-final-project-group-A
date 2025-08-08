import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import styles from "./DeletePostButton.module.css";

const DeletePostButton = ({ postAuthorId, postId }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get current user from protected endpoint
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setCurrentUser(data);
      } catch (err) {
        setError(`Unable to verify user: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Show nothing if loading user or user is not the author
  if (loading) return null;
  if (!currentUser || currentUser._id !== postAuthorId) return null;

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      const res = await fetch(`/api/post/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Failed to delete post");
      }

      navigate("/"); // redirect after deletion
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={styles.deleteButton}
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? "Deleting..." : "Delete Post"}
      </button>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

DeletePostButton.propTypes = {
  postAuthorId: PropTypes.string.isRequired,
  postId: PropTypes.string.isRequired,
};

export default DeletePostButton;
