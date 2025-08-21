import ProfileDash from "../components/ProfileDash/ProfileDash.jsx";
import { useEffect, useState } from "react";
import Post from "../components/Post/Post.jsx";
import useFetch from "../hooks/useFetch.js";
import { useParams } from "react-router-dom";

function Profile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);

  const { performFetch, error } = useFetch(`/user/${username}`, (response) => {
    setUserData(response.result);
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

  if (error) {
    console.error(error);
  }

  return (
    <>
      <ProfileDash size="lg" user={userData} followBtn={false} />
      <section>
        {userData &&
        Array.isArray(userData.posts) &&
        userData.posts.length > 0 ? (
          userData?.posts?.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <p>No posts found.</p>
        )}
      </section>
    </>
  );
}

export default Profile;
