import Button from "../Button.jsx";
import style from "./PostFooter.module.css";
import PropTypes from "prop-types";
import { LikeIcon, CommentIcon, ShareIcon, MoreIcon } from "../icons/index.js";

function PostFooter({ tags }) {
  return (
    <footer className={style.footer}>
      <section className={style.wrapper}>
        <section className={style.actionsContainer}>
          <Button icon={<LikeIcon style={style.icon} fill={false} />} />
          <Button icon={<CommentIcon style={style.icon} />} />
          <Button icon={<ShareIcon style={style.icon} />} />
        </section>
        <section className={style.tagsContainer}>
          <ul>
            {tags.length !== 0 &&
              tags.map((tag) => {
                return (
                  <li key={tag} className={style.tag}>
                    {tag}
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
};

export default PostFooter;
