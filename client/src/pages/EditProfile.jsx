import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import StateContext from "../context/state/StateContext.js";
import useFetchWithAuth from "../hooks/useFetchWithAuth.js";
import EditProfileForm from "../components/EditProfileForm/EditProfileForm.jsx";
import useSetError from "../hooks/useSetError.js";

export default function EditProfile() {
  const { username } = useParams();
  const { state: user } = useContext(StateContext);
  const [profile, setProfile] = useState(null);

  // GET profile
  const {
    isLoading,
    error: fetchError,
    performFetch: fetchProfile,
    cancelFetch,
  } = useFetchWithAuth(`/user/${username}`, (res) => {
    setProfile({
      username: res.user?.username || "",
      first_name: res.user?.profile?.first_name || "",
      last_name: res.user?.profile?.last_name || "",
      bio: res.user?.profile?.bio || "",
    });
  });

  useEffect(() => {
    setProfile(null);
    fetchProfile();
    return () => cancelFetch && cancelFetch();
  }, [username]);

  useSetError(fetchError);

  if (!user || !user.username) return <div>Loading user…</div>;
  if (user.username !== username) return <div>Not authorized</div>;
  if (isLoading && !profile) return <div>Loading…</div>;
  if (!profile) return null;

  return <EditProfileForm profile={profile} />;
}
