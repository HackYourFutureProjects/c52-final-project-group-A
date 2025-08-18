import ProfileDash from "../components/ProfileDash/ProfileDash.jsx";
import { useContext, useEffect, useState } from "react";
import UserDataContext from "../context/userDataContext/UserDataContext.js";
import Post from "../components/Post/Post.jsx";
import useFetch from "../hooks/useFetch.js";


function Profile() {
  const { userData } = useContext(UserDataContext);
  const [posts, setPosts] = useState([]);

  // TODO: create a new (reusable) component for the profile/user pages and move the fetch logic there
  const { performFetch, error } = useFetch(
    `/user/${userData?._id}`,
    (response) => {
      setPosts(response.result);
    },
  );

  useEffect(() => {
    if (!userData || !userData._id) return;
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    performFetch(options);
  }, []);

  if (error) {
    console.error(error);
  }

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
