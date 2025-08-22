import { Routes, Route, useLocation } from "react-router-dom";
import Nav from "./components/Nav/Nav.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Home from "./pages/Home/Home.jsx";
import NewPostPage from "./pages/NewPost/NewPost.jsx";
import StateContextProvider from "./context/state/StateContextProvider.jsx";
import EmailVerification from "./pages/EmailVerification.jsx";
import SandboxPage from "./pages/Sandbox.jsx";
import PostPage from "./pages/Post/Post.jsx";
import Fab from "./components/Fab/Fab.jsx";

const App = () => {
  const location = useLocation();
  const hideFabOn = ["/", "/login", "/register", "/new-post"]; // Nn FAB button here

  return (
    <StateContextProvider>
      <Nav />
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
      </Routes>
      {!hideFabOn.includes(location.pathname) && <Fab>Create post</Fab>}
    </StateContextProvider>
  );
};

export default App;
