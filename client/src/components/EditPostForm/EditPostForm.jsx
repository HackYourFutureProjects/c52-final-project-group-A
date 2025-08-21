import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../Button.jsx";
import InputField from "../InputField/InputField.jsx";
import style from "./EditPostForm.module.css";

export default function EditPostForm({ post, error, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: post?.title || "",
    content: post?.content || "",
    tags: Array.isArray(post?.tags) ? post.tags.join(", ") : "",
    status: post?.status || "DRAFT",
  });

  // Update form state when post changes
  useEffect(() => {
    if (post) {
      setForm({
        title: post.title || "",
        content: post.content || "",
        tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
        status: post.status || "DRAFT",
      });
    }
  }, [post]);

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
    <form className={style.postCard} onSubmit={handleSubmit}>
      {/* Title field */}
      <InputField
        name="title"
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        className={style.titleInput}
      />

      {/* Content field */}
      <textarea
        name="content"
        className={style.contentInput}
        placeholder="Content"
        value={form.content}
        onChange={handleChange}
        rows={8}
        required
      />

      {/* Tags field */}
      <InputField
        name="tags"
        type="text"
        placeholder="Tags (comma separated)"
        value={form.tags}
        onChange={handleChange}
        className={style.tagsInput}
      />

      {/* Status field */}
      <select
        name="status"
        className={style.statusSelect}
        value={form.status}
        onChange={handleChange}
      >
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
      </select>

      {error && <div className={style.error}>{error}</div>}

      <div className={style.buttonGroup}>
        <Button type="submit">Save</Button>
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
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
