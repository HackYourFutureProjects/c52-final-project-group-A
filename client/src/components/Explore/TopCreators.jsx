import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Avatar from "../Avatar/Avatar";
import Button from "../Button";
import styles from "./TopCreators.module.css";
import useAuthAction from "../../hooks/useAuthAction";

const TopCreators = ({ creators }) => {
  const handleAuthAction = useAuthAction();
  const navigate = useNavigate();

  if (!creators || creators.length === 0) {
    return (
      <div className={styles.card}>
        <h2 className={styles.title}>Top Bloggers</h2>
        <p>No top creators found.</p>
      </div>
    );
  }

  const handleFollow = () => {
    // Placeholder for follow logic add your fetch call here
  };

  const handleProfileClick = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Top Bloggers</h2>
      <ul className={styles.list}>
        {creators.map((creator) => (
          <li key={creator._id} className={styles.listItem}>
            <div
              className={styles.creatorLink}
              role="button"
              tabIndex={0}
              onClick={() =>
                handleAuthAction(() => handleProfileClick(creator.username))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleAuthAction(() => handleProfileClick(creator.username));
                }
              }}
            >
              <Avatar
                avatar={creator.avatar}
                alt={`${creator.fullName}'s avatar`}
                size="10"
              />
              <span className={styles.creatorName}>{creator.fullName}</span>
            </div>
            <Button
              className={styles.followButton}
              onClick={() => handleAuthAction(() => handleFollow(creator._id))}
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
