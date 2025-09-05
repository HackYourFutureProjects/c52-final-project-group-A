import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./TrendingTags.module.css";
import useAuthAction from "../../hooks/useAuthAction";

const TrendingTags = ({ tags }) => {
  const handleAuthAction = useAuthAction();
  const navigate = useNavigate();

  if (!tags || tags.length === 0) {
    return (
      <div className={styles.card}>
        <h2 className={styles.title}>Trending Tags</h2>
        <p>No trending tags found.</p>
      </div>
    );
  }

  const handleTagClick = (tag) => {
    navigate(`/tags/${tag}`);
  };

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Trending Tags</h2>
      <div className={styles.grid}>
        {tags.map((tag, index) => (
          <div
            key={`${tag}-${index}`}
            role="button"
            tabIndex={0}
            onClick={() => handleAuthAction(() => handleTagClick(tag))}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleAuthAction(() => handleTagClick(tag));
              }
            }}
            className={`${styles.tagLink} ${styles[`tag${index % 4}`]}`}
          >
            <span className={styles.tagName}>{tag}</span>
            <span className={styles.tagRank}>#{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

TrendingTags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TrendingTags;
