import Post from "../Post/Post.jsx";
import PropTypes from "prop-types";
import styles from "./Feed.module.css";

const Feed = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className={styles.container}>
        <h2>Trending Posts</h2>
        <p className={styles.emptyMessage}>
          No posts to display at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {posts.map((post) => (
          <li key={post._id}>
            <Post post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
};

Feed.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object), // Using generic object since Post component has its own prop validation
};

export default Feed;
