import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreatePost } from "../../util/CreatePost";

export default function CreatePostForm() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const data = {
        title,
        content,
        status,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      await CreatePost(data);

      // Redirect after success
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
      <h2>Create New Post</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      <div>
        <label>Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <button type="submit">Create Post</button>
    </form>
  );
}
