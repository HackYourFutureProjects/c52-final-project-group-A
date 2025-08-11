import ProfileDash from "../components/ProfileDash/ProfileDash.jsx";
import { useContext, useEffect } from "react";
import UserDataContext from "../context/userDataContext/UserDataContext.js";
import useFetch from "../hooks/useFetch.js";

function Profile() {
  const { userData, setUserData } = useContext(UserDataContext);

  const { error, performFetch } = useFetch("/profile", (response) => {
    setUserData(response.result);
  });

  if (!userData) {
    console.log("You are not logged in");
  }

  useEffect(() => {
    performFetch();
  }, [performFetch]);

  if (error) {
    console.log("Error fetching profile:", error);
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
