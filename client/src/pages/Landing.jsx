import { Link } from "react-router-dom";

function Landing() {
  return (
    <div>
      <h1>Landing Page</h1>
      <Link to="/new-post">Go to Create Post Page</Link>
    </div>
  );
}

export default Landing;
