import ProfileDash from "../../components/ProfileDash/ProfileDash.jsx";
import { useEffect, useState } from "react";
import Post from "../../components/Post/Post.jsx";
import useFetch from "../../hooks/useFetch.js";
import { useParams } from "react-router-dom";
import { useContext } from "react";
import StateContext from "../../context/state/StateContext.js";
import style from "./Profile.module.css";
import useWindowWidth from "../../hooks/useWindowWidth.js";

function Profile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const { state } = useContext(StateContext);
  const isUser = state.username === username;
  const mobile = useWindowWidth(768);

  const { performFetch, error } = useFetch(`/user/${username}`, (response) => {
    setUserData(response.user);
  });

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    console.log(username);
    performFetch(options);
  }, [username]);

  if (error) {
    console.error(error);
  }

  return (
    <main className={style.main}>
      <ProfileDash
        size={mobile ? "md" : "lg"}
        user={userData}
        followBtn={!isUser}
      />
      <div className={style.postsContainer}>
        {userData &&
        Array.isArray(userData.posts) &&
        userData.posts.length > 0 ? (
          userData?.posts?.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </main>
  );
}

export default Profile;
