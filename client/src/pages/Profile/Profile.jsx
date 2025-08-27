import ProfileDash from "../../components/ProfileDash/ProfileDash.jsx";
import { useEffect, useState, useContext } from "react";
import Post from "../../components/Post/Post.jsx";
import useFetch from "../../hooks/useFetch.js";
import { useParams, useNavigate } from "react-router-dom";
import StateContext from "../../context/state/StateContext.js";
import style from "./Profile.module.css";
import Button from "../../components/Button.jsx";

function Profile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const { state } = useContext(StateContext);
  const isUser = state.username === username;

  const { performFetch, error } = useFetch(`/user/${username}`, (response) => {
    setUserData(response.user);
  });

  const navigate = useNavigate();

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    performFetch(options);
  }, [username]);

  if (error) {
    console.error(error);
  }

  return (
    <main className={style.main}>
      <ProfileDash size="lg" user={userData} followBtn={!isUser} />

      {isUser && (
        <div className={style.editProfileBtnWrap}>
          <Button
            onClick={() => navigate(`/user/${username}/edit`)}
            className={style.editProfileBtn}
          >
            Edit Profile
          </Button>
        </div>
      )}

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
