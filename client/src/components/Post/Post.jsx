import ProfileDash from "../ProfileDash/ProfileDash.jsx";
import PostFooter from "../PostFooter/PostFooter.jsx";
import style from "./Post.module.css";
import PropTypes from "prop-types";
import timeAgoCalc from "../../util/timeAgoCalc.js";

function Post({ post }) {
  const publishedAgo = timeAgoCalc(new Date(post.published_at));
  console.log(publishedAgo);

  return (
    <article className={style.wrapper}>
      <ProfileDash
        size="sm"
        border="bottom"
        followBtn={true}
        user={post.author}
      />
      <section className={style.contentContainer}>
        <header className={style.headerContainer}>
          <h1>{post.title}</h1>
        </header>
        <p className={style.postContent}>{post.content}</p>
      </section>
      <PostFooter tags={post.tags} />
    </article>
  );
}

Post.propTypes = {
  post: {
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
  }.isRequired,
};

export default Post;
