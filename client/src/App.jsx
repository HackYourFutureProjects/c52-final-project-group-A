import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Nav/Nav.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Home from "./pages/Home/Home.jsx";
import NewPostPage from "./pages/NewPost/NewPost.jsx";
import EmailVerification from "./pages/EmailVerification.jsx";
import SearchBox from "./components/SearchBox/SearchBox";
import SandboxPage from "./pages/Sandbox.jsx";
import PostPage from "./pages/Post/Post.jsx";
import Fab from "./components/Fab/Fab.jsx";
import EditPostPage from "./pages/EditPost/EditPost.jsx";
import Explore from "./pages/Explore/Explore.jsx";
import { useContext } from "react";
import StateContext from "./context/state/StateContext.js";
import EditProfile from "./pages/EditProfile/EditProfile.jsx";

const App = () => {
  const location = useLocation();
  const { showSearchBox, setShowSearchBox, state } = useContext(StateContext);
  const hideFabOn = ["/", "/login", "/register", "/new-post"]; // No FAB button here

  return (
    <>
      <Nav setShowSearchBox={setShowSearchBox} showSearchBox={showSearchBox} />
      {showSearchBox && state.userId && (
        <SearchBox onClose={() => setShowSearchBox(false)} />
      )}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user/:username" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/new-post" element={<NewPostPage />} />
        <Route path="/sandbox" element={<SandboxPage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/post/:id/edit" element={<EditPostPage />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/user/:username/edit" element={<EditProfile />} />
      </Routes>
      {!hideFabOn.includes(location.pathname) && <Fab />}
    </>
  );
};

export default App;
