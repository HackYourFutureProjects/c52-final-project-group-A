import { useCallback, useState, useEffect } from "react";
import style from "./LikeButton.module.css";
import useFetchWithAuth from "../../hooks/useFetchWithAuth.js";
import PropTypes from "prop-types";
import Button from "../Button.jsx";
import { LikeIcon } from "../icons/index.js";

export default function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);

  const handleStatus = useCallback((data) => {
    setLiked(Boolean(data.liked));
  }, []);
  const { performFetch: fetchLikeStatus, cancelFetch } = useFetchWithAuth(
    `/posts/${postId}/like`,
    handleStatus,
  );
  useEffect(() => {
    fetchLikeStatus();
    return () => cancelFetch && cancelFetch();
  }, [postId]);

  const { performFetch: sendLike } = useFetchWithAuth(
    `/posts/${postId}/like`,
    (data) => setLiked(Boolean(data.liked)),
  );
  const handleToggle = () => {
    sendLike({ method: "POST", credentials: "include" });
  };

  return (
    <Button
      type="button"
      aria-pressed={liked}
      className={style.likeButton}
      onClick={handleToggle}
      title={liked ? "Unlike" : "Like"}
      icon={<LikeIcon style={style.icon} fill={liked} />}
    />
  );
}

LikeButton.propTypes = {
  postId: PropTypes.string.isRequired,
};
