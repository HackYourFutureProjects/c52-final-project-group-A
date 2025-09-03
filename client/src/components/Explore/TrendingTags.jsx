import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./TrendingTags.module.css";
import useAuthRedirect from "../../hooks/useAuthRedirect.js";

const TrendingTags = ({ tags }) => {
  const { redirectIfNotAuth, isAuthenticated } = useAuthRedirect();

  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Trending Tags</h2>
      <div className={styles.grid}>
        {tags.map((tagInfo, index) => {
          const tagClass = styles[`tag${index % 4}`];
          return (
            <Link
              to={`/explore/tags/${tagInfo.tag}`}
              key={tagInfo.tag}
              className={`${styles.tagLink} ${tagClass}`}
              onClick={(e) =>
                !isAuthenticated &&
                redirectIfNotAuth(e, `/explore/tags/${tagInfo.tag}`)
              }
            >
              <div className={styles.tagRank}>#{index + 1}</div>
              <div className={styles.tagName}>{tagInfo.tag}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

TrendingTags.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      tag: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default TrendingTags;
