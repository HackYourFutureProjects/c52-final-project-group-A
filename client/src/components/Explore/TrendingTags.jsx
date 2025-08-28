import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./TrendingTags.module.css";

const TrendingTags = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const tagColors = [
    { bg: "var(--color-yellow)", text: "var(--color-black)" },
    { bg: "rgba(254, 74, 34, 0.2)", text: "var(--color-orange)" },
    { bg: "rgba(204, 204, 204, 0.3)", text: "var(--color-dark-grey)" },
    { bg: "rgba(255, 208, 38, 0.3)", text: "var(--color-black)" },
  ];

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>Trending Tags</h2>
      <div className={styles.grid}>
        {tags.map((tagInfo, index) => {
          const color = tagColors[index % tagColors.length];
          return (
            <Link
              to={`/explore/tags/${tagInfo.tag}`}
              key={tagInfo.tag}
              className={styles.tagLink}
              style={{
                backgroundColor: color.bg,
                color: color.text,
              }}
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
