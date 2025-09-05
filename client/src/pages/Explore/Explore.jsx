import { useState, useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import Feed from "../../components/Feed/Feed";
import TopCreators from "../../components/Explore/TopCreators";
import TrendingTags from "../../components/Explore/TrendingTags";
import styles from "./Explore.module.css";

const Explore = () => {
  const [exploreData, setExploreData] = useState({
    trendingPosts: [],
    topCreators: [],
    trendingTags: [],
  });

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/explore",
    (data) => {
      if (data.success) {
        setExploreData({
          trendingPosts: data.trendingPosts || [],
          topCreators: data.topCreators || [],
          trendingTags: data.trendingTags || [],
        });
      }
    },
  );

  useEffect(() => {
    performFetch();
    return cancelFetch;
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={styles.container}>
      <aside className={styles.leftSidebar}>
        <p>This is the left sidebar</p>
      </aside>
      <main className={styles.mainContent}>
        <Feed posts={exploreData.trendingPosts} />
      </main>
      <aside className={styles.rightSidebar}>
        <TopCreators creators={exploreData.topCreators} />
        <TrendingTags tags={exploreData.trendingTags} />
      </aside>
    </div>
  );
};

export default Explore;
