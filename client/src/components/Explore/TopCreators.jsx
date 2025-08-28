import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import styles from "./TopCreators.module.css";

const TopCreators = ({ creators }) => {
  if (!creators || creators.length === 0) {
    return null;
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Trending Blogs</h3>
      <ul className={styles.list}>
        {creators.map((creator) => (
          <li key={creator._id} className={styles.listItem}>
            <Link
              to={`/profile/${creator.username}`}
              className={styles.creatorLink}
            >
              <Avatar
                src={creator.profile_image_url}
                alt={`${creator.username}'s avatar`}
                size="10"
              />
              <span className={styles.creatorName}>{creator.username}</span>
            </Link>
            <button
              className={styles.followButton}
              onClick={() => {
                /* Placeholder for follow functionality */
              }}
            >
              Follow
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

TopCreators.propTypes = {
  creators: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      profile_image_url: PropTypes.string,
    }),
  ).isRequired,
};

export default TopCreators;
