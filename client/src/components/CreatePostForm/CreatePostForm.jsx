import { useState } from "react";
import PropTypes from "prop-types";
import useFetchWithAuth from "../../hooks/useFetchWithAuth";
import Button from "../Button.jsx";
import InputField from "../InputField/InputField.jsx";
import style from "./CreatePostForm.module.css";
import TextArea from "../TextArea/TextArea.jsx";
import Drawer from "../Drawer/Drawer.jsx";

export default function CreatePostForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState("");

  const { isLoading, error, performFetch } = useFetchWithAuth(
    "/post",
    (post) => {
      onCreated?.(post);
      setTitle("");
      setContent("");
      setTagsInput("");
      setStatus("DRAFT");
    },
  );

  const onSubmit = (e) => {
    e.preventDefault();
    performFetch({
      method: "POST",
      body: JSON.stringify({
        title: title.trim(),
        content: content.trim(),
        status: status ?? "DRAFT",
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });
  };

  return (
    <main className={style.main}>
      <form onSubmit={onSubmit} className={style.form}>
        <h1 className={style.title}>Create a new post</h1>
        <InputField
          name="title"
          placeholder="Title*"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <TextArea
          name="content"
          placeholder="Content*"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div className={style.optionsContainer}>
          <Drawer
            name="status"
            value={status}
            options={["DRAFT", "PUBLISHED"]}
            placeholder="Select status"
            onChange={(e) => setStatus(e.target.value)}
          />
          <InputField
            name="tags"
            type="text"
            placeholder="Tags (comma-separated)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>

        {error && <p style={{ color: "red" }}>{String(error)}</p>}

        <Button type="submit" disabled={isLoading} className={style.submitBtn}>
          {isLoading ? "Saving..." : "Create"}
        </Button>
      </form>
    </main>
  );
}

CreatePostForm.propTypes = {
  onCreated: PropTypes.func,
};
