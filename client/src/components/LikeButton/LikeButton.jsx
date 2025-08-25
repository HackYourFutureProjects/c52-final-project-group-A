import { useCallback, useState, useEffect } from "react";
import style from "./LikeButton.module.css";
import useFetchWithAuth from "../../hooks/useFetchWithAuth.js";
import PropTypes from "prop-types";

export default function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);

  // GET the like status
  const handleStatus = useCallback((data) => {
    setLiked(Boolean(data.liked));
  }, []);

  const {
    performFetch: fetchLikeStatus,
    cancelFetch,
    error: fetchStatusError,
  } = useFetchWithAuth(`/posts/${postId}/like`, handleStatus);

  useEffect(() => {
    fetchLikeStatus();
    return () => cancelFetch && cancelFetch();
  }, [postId]);

  // POST the like toggle
  const { performFetch: sendLike, error: sendLikeError } = useFetchWithAuth(
    `/posts/${postId}/like`,
    (data) => setLiked(Boolean(data.liked)),
  );

  const handleToggle = () => {
    sendLike({ method: "POST", credentials: "include" });
  };

  // Error logging for debugging
  if (fetchStatusError) console.error("Fetch status error:", fetchStatusError);
  if (sendLikeError) console.error("Send like error:", sendLikeError);

  return (
    <button
      type="button"
      aria-pressed={liked}
      className={style.likeButton}
      onClick={handleToggle}
      title={liked ? "Unlike" : "Like"}
    >
      <svg
        className={style.icon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M12 7.69431C10 2.99988 3 3.49988 3 9.49991C3 15.4999 12 20.5001 12 20.5001C12 20.5001 21 15.4999 21 9.49991C21 3.49988 14 2.99988 12 7.69431Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={liked ? "#FE4A22" : "none"}
          />
        </g>
      </svg>
    </button>
  );
}

LikeButton.propTypes = {
  postId: PropTypes.string.isRequired,
};
