import PropTypes from "prop-types";
import Button from "../Button.jsx";
import useFetch from "../../hooks/useFetch";

function DeletePostButton({ postId, onDelete }) {
  const { performFetch } = useFetch(`/post/${postId}`, () => {
    if (onDelete) onDelete();
  });

  const handleDelete = () => {
    if (!postId) return;
    if (!window.confirm("Delete post?")) return;
    performFetch({ method: "DELETE" });
  };

  return <Button onClick={handleDelete}>Delete</Button>;
}

DeletePostButton.propTypes = {
  postId: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

export default DeletePostButton;
