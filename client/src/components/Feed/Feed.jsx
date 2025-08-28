import PropTypes from "prop-types";
import Post from "../Post/Post";
import styles from "./Feed.module.css";

const Feed = ({ posts }) => {
  return (
    <div>
      {posts?.length > 0 ? (
        <div className={styles.postsGrid}>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className={styles.noPosts}>
          <p>No posts to show at the moment.</p>
          <p className={styles.noPostsSubtext}>
            Check back later to see what&apos;s new!
          </p>
        </div>
      )}
    </div>
  );
};

Feed.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
};

Feed.defaultProps = {
  posts: [],
};

export default Feed;
