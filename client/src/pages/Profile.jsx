import ProfileDash from "../components/ProfileDash/ProfileDash.jsx";
import { useContext } from "react";
import UserDataContext from "../context/userDataContext/UserDataContext.js";
// import Post from "../components/Post/Post.jsx";

function Profile() {
  const { userData } = useContext(UserDataContext);

  if (!userData) {
    console.log("You are not logged in");
  }

  return (
    <>
      <ProfileDash size="lg" user={userData} followBtn={false} />
      {/* <Post /> <--- this can creates an error and crashes the server because we do not forward the required props. Later we will have more props here. Example, Post({ post, liked, onLikeToggle }) */}
    </>
  );
}

export default Profile;
