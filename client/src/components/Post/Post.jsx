import ProfileDash from "../ProfileDash/ProfileDash.jsx";
import PostFooter from "../PostFooter/PostFooter.jsx";
import style from "./Post.module.css";

function Post() {
  return (
    <article className={style.wrapper}>
      <ProfileDash size="sm" border="bottom" followBtn={false} />
      <section className={style.contentContainer}>
        <header className={style.headerContainer}>
          <h1>Post</h1>
        </header>
        <p className={style.postContent}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </section>
      <PostFooter />
    </article>
  );
}

export default Post;
