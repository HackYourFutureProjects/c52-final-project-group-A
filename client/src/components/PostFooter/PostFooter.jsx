import { useState, useRef, useEffect } from "react";
import Button from "../Button.jsx";
import style from "./PostFooter.module.css";
import PropTypes from "prop-types";
import { CommentIcon, ShareIcon, MoreIcon } from "../icons/index.js";
import LikeButton from "../LikeButton/LikeButton.jsx";
import { Link } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../context/user/UserContext.js";
import useFetch from "../../hooks/useFetch.js";

const { redirectIfNotAuth, isAuthenticated } = useAuthRedirect();
function PostFooter({ postId, tags, authorId }) {
  const { user } = useContext(UserContext);
  const isAuthor = user.userId?.toString() === authorId?.toString();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { performFetch } = useFetch(`/post/${postId}`, () => {
    setMenuOpen(false);
  });

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
  const handleDelete = () => {
    if (!postId) return;
    if (!window.confirm("Delete post?")) return;
    performFetch({ method: "DELETE" });
  };

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
              tags.map((tag) => {
                return (
                  <li key={tag} className={style.tag}>
                    <Link
                      to={`/tag/${tag}`}
                      className={style.tagLink}
                      onClick={(e) =>
                        !isAuthenticated && redirectIfNotAuth(e, `/tag/${tag}`)
                      }
                    >
                      {tag}
                    </Link>
                  </li>
                );
              })}

          </ul>
        </section>
      </section>
      {isAuthor && (
        <span style={{ position: "relative", display: "inline-block" }}>
          <Button
            style={{ position: "relative" }}
            icon={<MoreIcon style={style.icon} />}
            onClick={() => setMenuOpen((open) => !open)}
          />
          {menuOpen && (
            <div className={style.menuPopover} ref={menuRef}>
              <Button className={style.menuBtn} onClick={handleEdit}>
                Edit post
              </Button>
              <Button className={style.menuBtn} onClick={handleDelete}>
                Delete post
              </Button>
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
