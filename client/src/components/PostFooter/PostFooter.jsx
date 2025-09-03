import { useState, useRef, useEffect } from "react";
import Button from "../Button.jsx";
import style from "./PostFooter.module.css";
import PropTypes from "prop-types";
import { CommentIcon, ShareIcon, MoreIcon } from "../icons/index.js";
import LikeButton from "../LikeButton/LikeButton.jsx";
import { useNavigate } from "react-router-dom";
import DeletePostButton from "../DeletePostButton/DeletePostButton.jsx";
import { useContext } from "react";
import StateContext from "../../context/state/StateContext.js";

function PostFooter({ postId, tags, authorId }) {
  const { state } = useContext(StateContext);
  const isAuthor = state.userId?.toString() === authorId?.toString();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleEdit = () => {
    navigate(`/post/${postId}/edit`);
    setMenuOpen(false);
  };

  return (
    <footer className={style.footer}>
      <section className={style.wrapper}>
        <section className={style.actionsContainer}>
          <LikeButton postId={postId} />
          <Button
            className={style.actionButton}
            icon={<CommentIcon style={style.icon} />}
          />
          <Button
            className={style.actionButton}
            icon={<ShareIcon style={style.icon} />}
          />
        </section>
        <section className={style.tagsContainer}>
          <ul>
            {tags.length !== 0 &&
              tags.map((tag) => (
                <li key={tag} className={style.tag}>
                  {tag}
                </li>
              ))}
          </ul>
        </section>
      </section>
      {isAuthor && (
        <span style={{ position: "relative", display: "inline-block" }}>
          <Button
            style={{ position: "relative" }}
            className={style.actionButton}
            icon={<MoreIcon style={style.icon} />}
            onClick={() => setMenuOpen((open) => !open)}
          />
          {menuOpen && (
            <div className={style.menuPopover} ref={menuRef}>
              <Button className={style.menuBtn} onClick={handleEdit}>
                Edit post
              </Button>
              <DeletePostButton
                postId={postId}
                className={style.menuBtn}
                onDelete={() => setMenuOpen(false)}
              >
                Delete post
              </DeletePostButton>
            </div>
          )}
        </span>
      )}
    </footer>
  );
}

PostFooter.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  postId: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
};

export default PostFooter;
