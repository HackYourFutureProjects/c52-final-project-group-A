import ProfileDash from "../components/ProfileDash/ProfileDash.jsx";
import { useContext, useEffect, useState } from "react";
import UserDataContext from "../context/userDataContext/UserDataContext.js";
import Post from "../components/Post/Post.jsx";
import useFetch from "../hooks/useFetch.js";

function Profile() {
  const { userData } = useContext(UserDataContext);
  const [posts, setPosts] = useState([]);

  const { performFetch } = useFetch(`/post/${userData?._id}`, (response) => {
    setPosts(response.result);
  });

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    performFetch(options);
  }, []);

  return (
    <>
      <ProfileDash size="lg" user={userData} followBtn={false} />
      <section>
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <p>No posts found.</p>
        )}
      </section>
    </>
  );
}

export default Profile;
