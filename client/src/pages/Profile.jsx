import ProfileDash from "../components/ProfileDash/ProfileDash.jsx";
import { useContext } from "react";
import UserDataContext from "../context/userDataContext/UserDataContext.js";

function Profile() {
  const { userData } = useContext(UserDataContext);

  if (!userData) {
    console.log("You are not logged in");
  }

  return (
    <>
      <ProfileDash size="lg" user={userData} />
      <ProfileDash size="lg" />
      <ProfileDash size="md" user={userData} />
      <ProfileDash size="md" />
      <ProfileDash size="sm" user={userData} />
      <ProfileDash size="sm" />
    </>
  );
}

export default Profile;
