import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Home from "./pages/Home/Home.jsx";
import NewPostPage from "./pages/NewPost/NewPost.jsx";
import UserDataContextProvider from "./context/userDataContext/UserDataContextProvider.jsx";
import EmailVerification from "./pages/EmailVerification.jsx";
import SandboxPage from "./pages/Sandbox.jsx";
import PostPage from "./pages/Post/Post.jsx";

const App = () => {
  return (
    <>
      <UserDataContextProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/user/:id" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/new-post" element={<NewPostPage />} />
          <Route path="/sandbox" element={<SandboxPage />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </UserDataContextProvider>
    </>
  );
};

export default App;
