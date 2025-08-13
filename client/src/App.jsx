import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Home from "./pages/Home.jsx";
import UserDataContextProvider from "./context/userDataContext/UserDataContextProvider.jsx";
import EmailVerification from "./pages/EmailVerification.jsx";
import SandboxPage from "./pages/Sandbox/Sandbox.jsx";
import PostPage from "./pages/Post/Post";
<<<<<<< HEAD
=======
import EmailVerification from "./pages/EmailVerification.jsx";
>>>>>>> 1106dfc (prettir fix)

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
          <Route path="/sandbox" element={<SandboxPage />} />
          <Route path="/post/:id" element={<PostPage />} />
<<<<<<< HEAD
=======
          <Route path="/verify-email" element={<EmailVerification />} />
>>>>>>> 1106dfc (prettir fix)
        </Routes>
      </UserDataContextProvider>
    </>
  );
};

export default App;
