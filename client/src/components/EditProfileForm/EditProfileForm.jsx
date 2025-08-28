import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InputField from "../InputField/InputField.jsx";
import TextArea from "../TextArea/TextArea.jsx";
import Button from "../Button.jsx";
import style from "./EditProfileForm.module.css";

export default function EditProfileForm({ profile, error, onSave, onCancel }) {
  const [form, setForm] = useState({
    username: profile?.username || "",
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    bio: profile?.bio || "",
  });

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
    onSave(form);
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <InputField
        name="username"
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        required
        className={style.input}
      />
      <InputField
        name="first_name"
        type="text"
        placeholder="First name"
        value={form.first_name}
        onChange={handleChange}
        required
        className={style.input}
      />
      <InputField
        name="last_name"
        type="text"
        placeholder="Last name"
        value={form.last_name}
        onChange={handleChange}
        required
        className={style.input}
      />
      <TextArea
        name="bio"
        placeholder="Bio"
        value={form.bio}
        onChange={handleChange}
        className={style.textarea}
      />

      {error && <div className={style.error}>{error}</div>}

      <div className={style.buttonGroup}>
        <Button type="submit" className={style.submitBtn}>
          Save
        </Button>
        <Button type="button" className={style.cancelBtn} onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

EditProfileForm.propTypes = {
  profile: PropTypes.shape({
    username: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    bio: PropTypes.string,
  }).isRequired,
  error: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
