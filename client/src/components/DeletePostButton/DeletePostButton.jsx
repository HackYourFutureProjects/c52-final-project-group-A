import PropTypes from "prop-types";
import Button from "../Button.jsx";
import useFetchWithAuth from "../../hooks/useFetchWithAuth";

function DeletePostButton({ postId, onDelete, className }) {
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
        onClick={handleDelete}
        className={className}
        disabled={isLoading || !postId}
      >
        {isLoading ? "Deleting..." : "Delete"}
      </Button>
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
  className: PropTypes.string,
};

export default DeletePostButton;
