import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import TopCreators from "../../components/Explore/TopCreators";
import TrendingTags from "../../components/Explore/TrendingTags";
import Feed from "../../components/Feed/Feed";
import Spinner from "../../components/Spinner/Spinner";
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
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">
          Error fetching explore data: {error.message}
        </p>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Left section (placeholder for now) */}
        <aside className={styles.leftSidebar}>
          <p>This is the left sidebar </p>
        </aside>

        {/* Middle section (feed) */}
        <Feed posts={exploreData?.trendingPosts} />

        {/* Right section (Top creators + Trending tags) */}
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
    </div>
  );
};

export default Explore;
