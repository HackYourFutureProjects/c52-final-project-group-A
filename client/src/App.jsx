import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreatePostPage from "./pages/CreatePost/CreatePost.jsx";
import Profile from "./pages/Profile.jsx";
import Home from "./pages/Home.jsx";
import UserDataContextProvider from "./context/userDataContext/UserDataContextProvider.jsx";
import EmailVerification from "./pages/EmailVerification.jsx";

const App = () => {
  // TODO: Adjust routes and their components
  return (
    <>
      <UserDataContextProvider>
        <Nav />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/new-post" element={<CreatePostPage />} />
        </Routes>
      </UserDataContextProvider>
    </>
  );
};

export default App;
