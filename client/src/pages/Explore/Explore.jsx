import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import TopCreators from "../../components/Explore/TopCreators";
import TrendingTags from "../../components/Explore/TrendingTags";
import Feed from "../../components/Feed/Feed";
import styles from "./Explore.module.css";

const Explore = () => {
  const [exploreData, setExploreData] = useState(null);
  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/explore",
    (data) => {
      setExploreData(data);
    },
  );

  useEffect(() => {
    performFetch();
    return cancelFetch;
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>
          Error fetching explore data: {error.message}
        </p>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <aside className={styles.leftSidebar}>
        <p>This is the left sidebar </p>
      </aside>

      <Feed posts={exploreData?.trendingPosts} />

      <aside className={styles.rightSidebar}>
        {exploreData?.topCreators && (
          <div className={styles.trendingTagsSection}>
            <TopCreators creators={exploreData.topCreators} />
          </div>
        )}
        {exploreData?.trendingTags?.length > 0 && (
          <div className={styles.trendingTagsSection}>
            <TrendingTags tags={exploreData.trendingTags} />
          </div>
        )}
      </aside>
    </div>
  );
};

export default Explore;
