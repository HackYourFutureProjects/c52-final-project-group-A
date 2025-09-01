import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfileDash from "../../components/ProfileDash/ProfileDash.jsx";
import Post from "../../components/Post/Post.jsx";
import useFetch from "../../hooks/useFetch.js";
import StateContext from "../../context/state/StateContext.js";
import Button from "../../components/Button.jsx";
import style from "./Profile.module.css";
import useWindowWidth from "../../hooks/useWindowWidth.js";

function Profile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const { state } = useContext(StateContext);
  const isUser = state.username === username;
  const mobile = useWindowWidth(768);
  const navigate = useNavigate();

  const { performFetch } = useFetch(`/user/${username}`, (response) => {
    setUserData(response.user);
  });

  useEffect(() => {
    const options = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };
    performFetch(options);
  }, [username]);

  return (
    <main className={style.main}>
      <ProfileDash
        size={mobile ? "md" : "lg"}
        user={userData}
        followBtn={!isUser}
      />

      {isUser && (
        <div className={style.editProfileBtnWrap}>
          <Button
            className={style.editProfileBtn}
            onClick={() => navigate(`/user/${username}/edit`)}
          >
            Edit Profile
          </Button>
        </div>
      )}
      <div className={style.postsContainer}>
        {userData?.posts?.length > 0 ? (
          userData.posts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </main>
  );
}

export default Profile;
