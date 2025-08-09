import ProfileDash from "../components/ProfileDash/ProfileDash.jsx";
import { useContext } from "react";
import UserDataContext from "../context/userDataContext/UserDataContext.js";

function Profile() {
  const { user } = useContext(UserDataContext);
  console.log(user);

  if (!user) {
    console.log("You are not logged in");
  }

  return (
    <>
      <ProfileDash size="lg" user={user} />
      <ProfileDash size="sm" />
    </>
  );
}

export default Profile;
