import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import Button from "../Button";
import styles from "./TopCreators.module.css";
import useAuthRedirect from "../../hooks/useAuthRedirect.js";

const TopCreators = ({ creators }) => {
  const { redirectIfNotAuth, isAuthenticated } = useAuthRedirect();

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
              onClick={(e) =>
                !isAuthenticated &&
                redirectIfNotAuth(e, `/profile/${creator.username}`)
              }
            >
              <Avatar
                avatar={creator.avatar}
                alt={`${creator.fullName}'s avatar`}
                size="10"
              />
              <span className={styles.creatorName}>{creator.fullName}</span>
            </Link>
            <Button
              className={styles.followButton}
              onClick={(e) => {
                if (!isAuthenticated) {
                  redirectIfNotAuth(e, `/profile/${creator.username}`);
                } else {
                  // Implement follow functionality here when user is authenticated
                  console.log(`Following ${creator.username}`);
                }
              }}
            >
              Follow
            </Button>
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
      fullName: PropTypes.string,
      avatar: PropTypes.string,
    }),
  ).isRequired,
};

export default TopCreators;
