import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import StateContext from "../../context/state/StateContext.js";
import Button from "../Button.jsx";
import style from "./PostFooter.module.css";
import PropTypes from "prop-types";
import { CommentIcon, ShareIcon, MoreIcon } from "../icons/index.js";
import LikeButton from "../LikeButton/LikeButton.jsx";
import DeletePostButton from "../DeletePostButton/DeletePostButton.jsx";

function PostFooter({ postId, tags, authorId }) {
  const { state } = useContext(StateContext);
  const userId = state.userId;
  console.log("PostFooter userId:", userId);
  console.log("PostFooter authorId:", authorId);
  const isAuthor = userId === authorId;
  console.log("isAuthor:", isAuthor);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <footer className={style.footer}>
      <section className={style.wrapper}>
        <section className={style.actionsContainer}>
          <LikeButton postId={postId} />
          <Button icon={<CommentIcon style={style.icon} />} />
          <Button icon={<ShareIcon style={style.icon} />} />
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
        <div className={style.menuWrapper}>
          <Button
            icon={<MoreIcon style={style.icon} />}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Post actions"
          />
          {menuOpen && (
            <ul className={style.menuPopover}>
              <li>
                <button
                  className={style.menuItem}
                  onClick={() => {
                    setMenuOpen(false);
                    navigate(`/post/${postId}/edit`);
                  }}
                >
                  Edit post
                </button>
              </li>
              <li>
                <DeletePostButton
                  postId={postId}
                  className={style.menuItem}
                  onDelete={() => {
                    setMenuOpen(false);
                    navigate("/home");
                  }}
                />
              </li>
            </ul>
          )}
        </div>
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
