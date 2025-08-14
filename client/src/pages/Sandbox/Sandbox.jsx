import { useState } from "react";
import DeletePostButton from "../../components/DeletePostButton/DeletePostButton.jsx";

export default function SandboxDeletePage() {
  const [postId, setPostId] = useState("");
  const [result, setResult] = useState("");

  const handleDeleteSuccess = () => {
    setResult("Post deleted successfully.");
    setPostId("");
  };

  return (
    <div>
      <h2>Sandbox</h2>
      <input
        type="text"
        value={postId}
        onChange={(e) => {
          setPostId(e.target.value);
          setResult("");
        }}
        placeholder="Enter post ID"
      />
      <DeletePostButton postId={postId} onDelete={handleDeleteSuccess} />
      {result && <div>{result}</div>}
    </div>
  );
}
