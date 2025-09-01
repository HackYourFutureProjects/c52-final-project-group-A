import { useEffect, useState, useCallback, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import Post from "../../components/Post/Post";
import style from "./Home.module.css";
import StateContext from "../../context/state/StateContext.js";

function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [currentBatch, setCurrentBatch] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { state } = useContext(StateContext);

  const { performFetch, cancelFetch } = useFetch(
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
      !state.isLoading &&
      !isLoadingMore
    ) {
      setCurrentBatch((prev) => prev + 1);
    }
  }, [hasMore, state.isLoading, isLoadingMore]);

  // Add scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (allPosts.length === 0 && !state.isLoading) {
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
