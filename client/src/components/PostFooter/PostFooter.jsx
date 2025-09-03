import Button from "../Button.jsx";
import style from "./PostFooter.module.css";
import PropTypes from "prop-types";
import { CommentIcon, ShareIcon, MoreIcon } from "../icons/index.js";
import LikeButton from "../LikeButton/LikeButton.jsx";
import { Link } from "react-router-dom";
import useAuthRedirect from "../../hooks/useAuthRedirect.js";

function PostFooter({ postId, tags }) {
  const { redirectIfNotAuth, isAuthenticated } = useAuthRedirect();
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
      <Button icon={<MoreIcon style={style.icon} />} />
    </footer>
  );
}

PostFooter.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  postId: PropTypes.string.isRequired,
};

export default PostFooter;
PostFooter.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};
