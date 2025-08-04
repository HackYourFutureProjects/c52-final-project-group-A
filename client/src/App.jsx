import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav/Nav.jsx";
import Home from "./pages/Home/Home";

const App = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
