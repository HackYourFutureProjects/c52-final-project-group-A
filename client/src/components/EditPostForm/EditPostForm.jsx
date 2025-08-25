import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../Button.jsx";
import InputField from "../InputField/InputField.jsx";
import style from "./EditPostForm.module.css";
import TextArea from "../TextArea/TextArea.jsx";
import Drawer from "../Drawer/Drawer.jsx";

export default function EditPostForm({ post, error, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: post?.title || "",
    content: post?.content || "",
    tags: Array.isArray(post?.tags) ? post.tags.join(", ") : "",
    status: post?.status || "DRAFT",
  });

  const options = ["DRAFT", "PUBLISHED"];

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
    <form className={style.form} onSubmit={handleSubmit}>
      <InputField
        name="title"
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        className={style.titleInput}
      />
      <TextArea
        name="content"
        placeholder="Content"
        value={form.content}
        onChange={handleChange}
        required
      />
      <InputField
        name="tags"
        type="text"
        placeholder="Tags (comma separated)"
        value={form.tags}
        onChange={handleChange}
        className={style.tagsInput}
      />
      <Drawer
        name="status"
        value={form.status}
        options={options}
        onChange={handleChange}
        placeholder="Select status"
      />

      {error && <div>{error}</div>}

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

EditPostForm.propTypes = {
  post: PropTypes.object.isRequired,
  error: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
