import ProfileDash from "../ProfileDash/ProfileDash.jsx";
import PostFooter from "../PostFooter/PostFooter.jsx";
import style from "./Post.module.css";
import PropTypes from "prop-types";
import timeAgoCalc from "../../util/timeAgoCalc.js";
import { useContext } from "react";
import stateContext from "../../context/state/StateContext.js";

function Post({ post, className, dashboard = true }) {
  const { state } = useContext(stateContext);
  const isUser = state.userId === post.author._id;

  const publishedAgo = timeAgoCalc(new Date(post.published_at));
  console.log(publishedAgo);

  return (
    <article className={[style.wrapper, className].filter(Boolean).join(" ")}>
      {dashboard && (
        <ProfileDash
          size="sm"
          border="bottom"
          followBtn={!isUser}
          user={post.author}
        />
      )}
      <section className={style.contentContainer}>
        <header className={style.headerContainer}>
          <h1>{post.title}</h1>
        </header>
        <p className={style.postContent}>{post.content}</p>
      </section>
      <PostFooter postId={post._id} tags={post.tags} />
    </article>
  );
}

Post.propTypes = {
  post: PropTypes.shape({
    author: {
      _id: PropTypes.string,
      username: PropTypes.string,
      profile: PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        avatar: PropTypes.string,
        bio: PropTypes.string,
      }),
      score: PropTypes.number,
    },
    content: PropTypes.string,
    created_at: PropTypes.string,
    published_at: PropTypes.string,
    score: PropTypes.number,
    status: PropTypes.oneOf(["DRAFT", "PUBLISHED", "ARCHIVED"]),
    tags: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    __v: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
  dashboard: PropTypes.bool,
};

export default Post;
