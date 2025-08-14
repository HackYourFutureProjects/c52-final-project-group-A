import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SandboxPage() {
  const navigate = useNavigate();
  const [postId, setPostId] = useState("");
  const [error, setError] = useState("");

  const isValidObjectId = (v) => /^[a-fA-F0-9]{24}$/.test(v);

  const goToPost = (e) => {
    e.preventDefault();
    const id = postId.trim();
    if (!isValidObjectId(id)) {
      setError("Please enter a valid 24‑char Mongo ObjectId.");
      return;
    }
    setError("");
    navigate(`/post/${id}`);
  };

  return (
    <div className="p-4 max-w-xl space-y-3">
      <h1 className="text-2xl font-semibold">Posts Sandbox</h1>
      <form onSubmit={goToPost} className="space-y-2">
        <label className="block">
          <span className="text-sm">Enter Post ID</span>
          <input
            className="w-full border rounded p-2"
            placeholder="e.g. 64f0c0a1b2c3d4e5f6a7b8c9"
            value={postId}
            onChange={(e) => setPostId(e.target.value)}
          />
        </label>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="px-4 py-2 rounded bg-black text-white">
          Open post
        </button>
      </form>
    </div>
  );
}
