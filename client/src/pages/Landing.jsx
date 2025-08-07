import { Link } from "react-router-dom";

function Landing() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Landing Page</h1>
      <Link to="/test">temporary page for Posts</Link>
    </div>
  );
}

export default Landing;
