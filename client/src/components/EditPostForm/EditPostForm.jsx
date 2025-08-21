import { useState } from "react";
import PropTypes from "prop-types";
import Button from "../Button.jsx";
import InputField from "../InputField/InputField.jsx";
import style from "./EditPostForm.module.css";

export default function EditPostForm({ post, error, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: post.title,
    content: post.content,
    tags: post.tags.join(", "),
    status: post.status,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      title: form.title,
      content: form.content,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status: form.status,
    });
  };

  return (
    <form className={style.form} onSubmit={handleSubmit}>
      <InputField
        name="title"
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required={true}
      />

      <label htmlFor="content" className={style.label}>
        <textarea
          id="content"
          name="content"
          className={style.textarea}
          placeholder="Content"
          value={form.content}
          maxLength={10000}
          onChange={handleChange}
          required
          rows={10}
        />
        <span className={style.placeholder}>Content</span>
      </label>

      <InputField
        name="tags"
        type="text"
        placeholder="Tags (comma separated)"
        value={form.tags}
        onChange={handleChange}
      />

      <label htmlFor="status" className={style.label}>
        <select
          id="status"
          name="status"
          className={style.select}
          value={form.status}
          onChange={handleChange}
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
        <span className={style.placeholder}>Status</span>
      </label>

      {error && <div className={style.error}>{error}</div>}

      <div className={style.buttonGroup}>
        <Button type="submit">Save</Button>
        <Button type="button" onClick={onCancel}></Button>
      </div>
    </form>
  );
}

EditPostForm.propTypes = {
  post: PropTypes.object.isRequired,
  error: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
