import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <h1>Home Page</h1>
      <p>
        <Link to="/test">Temporary test link for Posts</Link>
      </p>
    </>
  );
}

export default Home;
