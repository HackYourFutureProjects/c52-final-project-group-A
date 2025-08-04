import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav.jsx";
import Home from "./pages/Home/Home";

import CreateUser from "./pages/User/CreateUser";
import UserList from "./pages/User/UserList";
import Post from "./pages/Post/Post.jsx";

const App = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/user" element={<UserList />} />
        <Route path="/user/create" element={<CreateUser />} />
        <Route path="/post" element={<Post />} />
      </Routes>
    </>
  );
};

export default App;
