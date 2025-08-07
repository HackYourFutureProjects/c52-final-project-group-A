import { Link } from "react-router-dom";

export default function TestPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>TEMPORARY test page</h1>
      <p>Test the path</p>
      <Link to="/post/68948a04d6f9d84248751d0f">Test the Post getting</Link>
    </div>
  );
}
