import { useEffect, useState, useCallback } from "react";
import useFetch from "../../hooks/useFetch";
import Post from "../../components/Post/Post";
import style from "./Home.module.css";

function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    `/feed?batch=${currentBatch}&limit=10`,
    (response) => {
      if (currentBatch === 1) {
        setAllPosts(response.data.items);
      } else {
        setAllPosts((prev) => [...prev, ...response.data.items]);
      }
      setHasMore(response.data.pagination.hasNext);
      setIsLoadingMore(false);
    },
  );

  // Initial load
  useEffect(() => {
    performFetch({
      method: "GET",
    });

    return () => {
      cancelFetch();
    };
  }, []);

  useEffect(() => {
    if (currentBatch > 1) {
      setIsLoadingMore(true);
      performFetch({
        method: "GET",
      });
    }
  }, [currentBatch]);

  // Scroll handler
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000 &&
      hasMore &&
      !isLoading &&
      !isLoadingMore
    ) {
      setCurrentBatch((prev) => prev + 1);
    }
  }, [hasMore, isLoading, isLoadingMore]);

  // Add scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (isLoading && currentBatch === 1) {
    return (
      <div className={style.container}>
        <div>Loading your feed...</div>
      </div>
    );
  }

  if (error && currentBatch === 1) {
    return (
      <div className={style.container}>
        <div>Error loading feed: {error.message || error}</div>
      </div>
    );
  }

  if (allPosts.length === 0 && !isLoading) {
    return (
      <div className={style.container}>
        <h1>Your Feed</h1>
        <div>No posts to show yet.</div>
      </div>
    );
  }

  return (
    <div className={style.container}>
      <div>
        {allPosts.map((post) => (
          <Post key={post._id} post={post} />
        ))}
      </div>

      {isLoadingMore && <div>Loading more posts...</div>}
    </div>
  );
}

export default Home;
