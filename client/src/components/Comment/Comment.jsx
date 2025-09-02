import ProfileDash from "../ProfileDash/ProfileDash.jsx";
import PropTypes from "prop-types";
import timeAgoCalc from "../../util/timeAgoCalc.js";
import style from "./Comment.module.css";

function Comment({ comment }) {
  const createdAgo = timeAgoCalc(new Date(comment.created_at));

  return (
    <article className={style.wrapper}>
      <ProfileDash
        size="sm"
        user={comment.user}
        border="bottom"
        followBtn={false}
      />
      <div className={style.commentSection}>
        <p>{comment.content}</p>
        <p className={style.timestamp}>{createdAgo}</p>
      </div>
    </article>
  );
}

Comment.propTypes = {
  comment: PropTypes.shape({
    _id: PropTypes.string,
    status: PropTypes.oneOf(["VISIBLE", "HIDDEN"]),
    created_at: PropTypes.string,
    user: PropTypes.shape({
      _id: PropTypes.string,
      username: PropTypes.string,
      profile: PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        avatar: PropTypes.string,
        bio: PropTypes.string,
        _id: PropTypes.string,
      }),
      score: PropTypes.number,
    }),
    post: PropTypes.string,
    content: PropTypes.string,
    __v: PropTypes.number,
  }),
};

export default Comment;
