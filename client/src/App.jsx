import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav.jsx";
import Home from "./pages/Home/Home";
import PostPage from "./pages/PostPage/PostPage.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";


const App = () => {
  // TODO: Adjust routes and their components
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts/:id" element={<PostPage />} />

        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<div>Home Page</div>} />
        <Route path="/profile" element={<div>Profile Page</div>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;
