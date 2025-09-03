import { useCallback, useState, useEffect, useContext } from "react";
import style from "./LikeButton.module.css";
import useFetch from "../../hooks/useFetch.js";
import PropTypes from "prop-types";
import Button from "../Button.jsx";
import { LikeIcon } from "../icons/index.js";
import StateContext from "../../context/state/StateContext.js";
import useAuthRedirect from "../../hooks/useAuthRedirect.js";

export default function LikeButton({ postId }) {
  const [liked, setLiked] = useState(false);
  const { state } = useContext(StateContext);
  const isAuth = !!state.userId;

  const { redirectIfNotAuth } = useAuthRedirect();

  // GET the like status
  const handleStatus = useCallback((data) => {
    setLiked(Boolean(data.liked));
  }, []);


  const { performFetch: fetchLikeStatus, cancelFetch } = useFetch(
    `/posts/${postId}/like`,
    handleStatus,
  );

  useEffect(() => {
    if (isAuth) {
      fetchLikeStatus();
    }
    return () => cancelFetch();
  }, [postId, isAuth]);

  // POST the like toggle
  const { performFetch: sendLike } = useFetch(`/posts/${postId}/like`, (data) =>
    setLiked(Boolean(data.liked)),
  );

  const handleToggle = (e) => {
    if (!isAuth) {
      redirectIfNotAuth(e);
      return;
    }
    sendLike({ method: "POST", credentials: "include" });
  };

  return (
    <Button
      type="button"
      aria-pressed={liked}
      className={style.likeButton}
      onClick={handleToggle}
      icon={<LikeIcon style={style.icon} fill={liked} />}
    />
  );
}

LikeButton.propTypes = {
  postId: PropTypes.string.isRequired,
};
