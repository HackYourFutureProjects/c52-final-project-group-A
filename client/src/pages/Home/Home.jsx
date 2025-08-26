import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Post from "../../components/Post/Post";
import style from "./Home.module.css";

function Home() {
  const [feedData, setFeedData] = useState(null);

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    "/feed",
    (response) => {
      setFeedData(response.data);
    },
  );

  useEffect(() => {
    // Fetch feed data when component mounts
    performFetch();

    // Cleanup function to cancel fetch when component unmounts
    return () => {
      cancelFetch();
    };
  }, []);

  if (isLoading) {
    return (
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.loading}>Loading your feed...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.error}>
            Error loading feed: {error.message || error}
          </div>
        </div>
      </div>
    );
  }

  if (!feedData || feedData.items.length === 0) {
    return (
      <div className={style.wrapper}>
        <div className={style.container}>
          <h1 className={style.header}>Your Feed</h1>
          <div className={style.emptyState}>
            No posts to show yet. Start following some users or check out the
            explore page!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.postsContainer}>
          {feedData.items.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
