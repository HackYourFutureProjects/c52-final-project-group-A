import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputField from "../InputField/InputField.jsx";
import TextArea from "../TextArea/TextArea.jsx";
import Button from "../Button.jsx";
import style from "./EditProfileForm.module.css";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch.js";

export default function EditProfileForm({ profile }) {
  const { username, first_name, last_name, bio } = profile;
  const [form, setForm] = useState({
    username: username || "",
    first_name: first_name || "",
    last_name: last_name || "",
    bio: bio || "",
  });
  const navigate = useNavigate();

  // PATCH profile
  const { performFetch } = useFetch(`/user/${username}/edit`, () => {
    navigate(`/user/${username}`);
  });
  const handleSave = (fields) => {
    performFetch({
      method: "PATCH",
      body: JSON.stringify({ profile: fields }),
      headers: { "Content-Type": "application/json" },
    });
  };

  useEffect(() => {
    setForm({
      username: profile?.username || "",
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      bio: profile?.bio || "",
    });
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(form);
  };

  return (
    <main className={style.main}>
      <form className={style.form} onSubmit={handleSubmit}>
        <h1 className={style.title}>Edit profile</h1>
        <InputField
          name="username"
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <InputField
          name="first_name"
          type="text"
          placeholder="First name"
          value={form.first_name}
          onChange={handleChange}
          required
        />
        <InputField
          name="last_name"
          type="text"
          placeholder="Last name"
          value={form.last_name}
          onChange={handleChange}
          required
        />
        <TextArea
          name="bio"
          placeholder="Bio"
          value={form.bio}
          onChange={handleChange}
        />
        <div className={style.buttonGroup}>
          <Button type="submit" className={style.submitBtn}>
            Save
          </Button>
          <Button
            type="button"
            className={style.cancelBtn}
            onClick={() => navigate(`/user/${username}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
}

EditProfileForm.propTypes = {
  profile: PropTypes.shape({
    username: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    bio: PropTypes.string,
  }).isRequired,
};
