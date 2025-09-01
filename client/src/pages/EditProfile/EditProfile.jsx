import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StateContext from "../../context/state/StateContext.js";
import useFetch from "../../hooks/useFetch.js";
import EditProfileForm from "../../components/EditProfileForm/EditProfileForm.jsx";
import style from "./EditProfile.module.css";

export default function EditProfile() {
  const { username } = useParams();
  const { state: user } = useContext(StateContext);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  // GET profile
  const { performFetch: fetchProfile, cancelFetch } = useFetch(
    `/user/${username}`,
    (res) => {
      setProfile({
        username: res.user?.username || "",
        first_name: res.user?.profile?.first_name || "",
        last_name: res.user?.profile?.last_name || "",
        bio: res.user?.profile?.bio || "",
      });
    },
  );

  // PATCH profile
  const { performFetch: patchProfile } = useFetch(
    `/user/${username}/edit`,
    () => {
      navigate(`/user/${username}`);
    },
  );

  useEffect(() => {
    setProfile(null);
    fetchProfile();
    return () => cancelFetch && cancelFetch();
  }, [username]);

  if (user.username !== username) return <div>Not authorized</div>;
  if (!profile) return null;

  const handleSave = (fields) => {
    patchProfile({
      method: "PATCH",
      body: JSON.stringify({ profile: fields }),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <main className={style.main}>
      <div className={style.profileContainer}>
        <h2 className={style.header}>Edit Profile</h2>
        <EditProfileForm
          profile={profile}
          onSave={handleSave}
          onCancel={() => navigate(`/user/${username}`)}
        />
      </div>
    </main>
  );
}
