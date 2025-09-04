import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import EditProfileForm from "../components/EditProfileForm/EditProfileForm.jsx";
import useFetch from "../hooks/useFetch.js";
import UserContext from "../context/user/UserContext.js";

export default function EditProfile() {
  const { username } = useParams();
  const { user } = useContext(UserContext);
  const [profile, setProfile] = useState(null);

  // GET profile
  const { performFetch, cancelFetch } = useFetch(`/user/${username}`, (res) => {
    setProfile({
      username: res.user?.username || "",
      first_name: res.user?.profile?.first_name || "",
      last_name: res.user?.profile?.last_name || "",
      bio: res.user?.profile?.bio || "",
    });
  });

  useEffect(() => {
    setProfile(null);
    performFetch();
    return () => cancelFetch && cancelFetch();
  }, [username]);

  if (!user || !user.username) return <div>Loading user…</div>;
  if (user.username !== username) return <div>Not authorized</div>;
  if (!profile) return null;

  return <EditProfileForm profile={profile} />;
}
