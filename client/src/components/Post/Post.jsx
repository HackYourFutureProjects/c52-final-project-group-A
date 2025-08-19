import ProfileDash from "../ProfileDash/ProfileDash.jsx";
import PostFooter from "../PostFooter/PostFooter.jsx";
import style from "./Post.module.css";
import PropTypes from "prop-types";
import timeAgoCalc from "../../util/timeAgoCalc.js";
import { useContext } from "react";
import UserDataContext from "../../context/userDataContext/UserDataContext.js";

function Post({ post }) {
  const publishedAgo = timeAgoCalc(new Date(post.published_at));
  console.log(publishedAgo);

  // Follow button visibility
  const userData = useContext(UserDataContext);
  const showFollowBtn = userData?._id !== post.author._id;

  return (
    <article className={style.wrapper}>
      <ProfileDash
        size="sm"
        border="bottom"
        followBtn={showFollowBtn}
        user={post.author}
      />
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
      email: PropTypes.string,
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
};

export default Post;

Post.propTypes = {
  post: PropTypes.shape({
    author: PropTypes.shape({
      _id: PropTypes.string,
      username: PropTypes.string,
      email: PropTypes.string,
    }),
    content: PropTypes.string,
    created_at: PropTypes.string,
    published_at: PropTypes.string,
    score: PropTypes.number,
    status: PropTypes.oneOf(["DRAFT", "PUBLISHED", "ARCHIVED"]),
    tags: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    __v: PropTypes.number,
    _id: PropTypes.string,
    likedByCurrentUser: PropTypes.bool,
  }).isRequired,
  liked: PropTypes.bool.isRequired,
  onLikeToggle: PropTypes.func.isRequired,
};
