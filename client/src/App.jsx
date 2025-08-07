import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PostPage from "./pages/Post/PostPage.jsx";
import TestPage from "./PostTestPage/PostTestPage";

const App = () => {
  // TODO: Adjust routes and their components
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<div>Home Page</div>} />
        <Route path="/profile" element={<div>Profile Page</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </>
  );
};

export default App;
