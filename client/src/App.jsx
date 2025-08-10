import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Home from "./pages/Home.jsx";
import DevPostPlayground from "./pages/DevPostPlayground.jsx"; // test page

const App = () => {
  // TODO: Adjust routes and their components
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/__dev/post" element={<DevPostPlayground />} />
      </Routes>
    </>
  );
};

export default App;
