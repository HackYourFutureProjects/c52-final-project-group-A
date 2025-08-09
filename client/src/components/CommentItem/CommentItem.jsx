import PropTypes from "prop-types";
import styles from "./commentItem.module.css";

export default function CommentItem({ comment }) {
  const username = comment?.user?.username || "User";
  const avatar = comment?.user?.avatar || "";
  const created = comment?.created_at || comment?.createdAt || Date.now();

  return (
    <div
      className={styles.item}
      role="article"
      aria-label={`Comment by ${username}`}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={`Avatar of ${username}`}
          className={styles.avatar}
        />
      ) : (
        <div className={styles.avatar} aria-hidden="true" />
      )}
      <div className={styles.body}>
        <div className={styles.head}>
          <strong className={styles.username}>{username}</strong>
          <time
            className={styles.meta}
            dateTime={new Date(created).toISOString()}
          >
            {new Date(created).toLocaleString()}
          </time>
        </div>
        <div className={styles.content}>{comment?.content}</div>
      </div>
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string,
    content: PropTypes.string.isRequired,
    created_at: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
    user: PropTypes.shape({
      username: PropTypes.string,
      avatar: PropTypes.string,
    }),
  }).isRequired,
};
