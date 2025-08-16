function Home() {
  // This is the management of likes on Feed. It should be uncommented when the feed is ready
  // const [posts, setPosts] = useState([]);

  // const handleLikeToggle = async (postId) => {
  //   const res = await fetch(`/api/posts/${postId}/like`, { method: "POST", credentials: "include" });
  //   const data = await res.json();
  //   setPosts(posts =>
  //     posts.map(post =>
  //       post._id === postId
  //         ? { ...post, likedByCurrentUser: data.liked }
  //         : post
  //     )
  //   );
  // };

  return <>Home Page</>;
}

export default Home;
