import PropTypes from "prop-types";
import Button from "../Button.jsx";
import useFetchWithAuth from "../../hooks/useFetchWithAuth";

function DeletePostButton({ postId, onDelete }) {
  const { isLoading, error, performFetch } = useFetchWithAuth(
    `/post/${postId}`,
    () => {
      if (onDelete) onDelete();
    },
  );

  const handleDelete = () => {
    if (!postId) return;
    if (!window.confirm("Delete post?")) return;
    performFetch({ method: "DELETE" });
  };

  return (
    <>
      <Button
        label={isLoading ? "Deleting..." : "Delete"}
        onClick={handleDelete}
        disabled={isLoading || !postId}
      />
      {error && (
        <div style={{ color: "red" }}>
          {error.message ? error.message : String(error)}
        </div>
      )}
    </>
  );
}

DeletePostButton.propTypes = {
  postId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default DeletePostButton;
