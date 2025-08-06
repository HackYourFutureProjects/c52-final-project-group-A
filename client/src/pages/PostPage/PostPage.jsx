import Nav from "../../components/Nav/Nav";
import SinglePost from "../../components/SinglePost/SinglePost";
import styles from "./PostPage.module.css";

const PostPage = () => {
  return (
    <>
      <Nav />
      <main className={styles.pageContainer}>
        <SinglePost />
      </main>
    </>
  );
};

export default PostPage;
