import { useState } from "react";
import PropTypes from "prop-types";
import useFetchWithAuth from "../../hooks/useFetchWithAuth";

export default function CreatePostForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [status, setStatus] = useState("DRAFT");

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
        status,
        tags: tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3 max-w-xl">
      <label>
        Title*
        <input
          className="w-full border p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label>
        Content*
        <textarea
          className="w-full border p-2"
          rows={8}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label>
          Post status
          <select
            className="w-full border p-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="DRAFT">DRAFT</option>
            <option value="PUBLISHED">PUBLISHED</option>
          </select>
        </label>

        <label>
          Gegs (Separated by commas)
          <input
            className="w-full border p-2"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </label>
      </div>

      {error && <p style={{ color: "red" }}>{String(error)}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="px-4 py-2 bg-black text-white rounded"
      >
        {isLoading ? "Saving..." : "Create"}
      </button>
    </form>
  );
}

CreatePostForm.propTypes = {
  onCreated: PropTypes.func,
};
