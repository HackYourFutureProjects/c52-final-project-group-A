import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "../Button.jsx";
import InputField from "../InputField/InputField.jsx";
import style from "./EditPostForm.module.css";
import TextArea from "../TextArea/TextArea.jsx";
import Drawer from "../Drawer/Drawer.jsx";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch.js";

export default function EditPostForm({ post }) {
  const { _id: id } = post;
  const [form, setForm] = useState({
    title: post?.title || "",
    content: post?.content || "",
    tags: Array.isArray(post?.tags) ? post.tags.join(", ") : "",
    status: post?.status || "DRAFT",
  });
  const navigate = useNavigate();

  // PATCH hook for updating post
  const { performFetch } = useFetch(`/post/${id}`, (res) => {
    if (res.success) navigate(`/post/${id}`); // redirect to post page after save
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
    handleSave({
      title: form.title,
      content: form.content,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status: form.status,
    });
  };

  const handleSave = (fields) => {
    performFetch({
      method: "PATCH",
      body: JSON.stringify(fields),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <main className={style.main}>
      <form className={style.form} onSubmit={handleSubmit}>
        <h1 className={style.title}>Edit post</h1>
        <InputField
          name="title"
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <TextArea
          name="content"
          placeholder="Content"
          value={form.content}
          onChange={handleChange}
          required
        />
        <div className={style.optionsContainer}>
          <Drawer
            name="status"
            value={form.status}
            options={["DRAFT", "PUBLISHED"]}
            placeholder="Select status"
            onChange={handleChange}
          />
          <InputField
            name="tags"
            type="text"
            placeholder="Tags (comma-separated)"
            value={form.tags}
            onChange={handleChange}
          />
        </div>
        <div className={style.buttonGroup}>
          <Button type="submit" className={style.submitBtn}>
            Save
          </Button>
          <Button
            type="button"
            className={style.cancelBtn}
            onClick={() => navigate(`/post/${id}`)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
}

EditPostForm.propTypes = {
  post: PropTypes.shape({
    _id: PropTypes.string,
    status: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    title: PropTypes.string,
    content: PropTypes.string,
    created_at: PropTypes.string,
    published_at: PropTypes.string,
    author: PropTypes.shape({
      _id: PropTypes.string,
      username: PropTypes.string,
      profile: PropTypes.shape({
        _id: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        bio: PropTypes.string,
        avatar: PropTypes.string,
      }),
      score: PropTypes.number,
    }),
    score: PropTypes.number,
    __v: PropTypes.number,
  }),
};
