import { Link } from "react-router-dom";
import style from "./Nav.module.css";
import Button from "../Button.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import Logo from "../Logo.jsx";
import UserDataContext from "../../context/userDataContext/UserDataContext.js";
import useWindowWidth from "../../hooks/useWindowWidth.js";
import PropTypes from "prop-types";
import { HomeIcon, SearchIcon, ProfileIcon } from "../icons/index.js";

function Nav({ setShowSearchBox }) {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = useWindowWidth(768);
  const { userData } = useContext(UserDataContext);

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <nav className={style.navContainer}>
      <ul className={style.nav}>
        <li
          className={
            location.pathname === "/home"
              ? style.navButtonActive
              : style.navButton
          }
        >
          <Link to={userData ? "/home" : "/login"}>
            {mobile ? <HomeIcon style={style.homeIcon} /> : "Home"}
          </Link>
        </li>
        <li className={style.navButton}>
          <button
            onClick={() => setShowSearchBox(true)}
            className={style.searchButton}
          >
            {mobile ? <SearchIcon /> : "Search"}
          </button>
          <Link to="#">
            {mobile ? <SearchIcon style={style.searchIcon} /> : "Search"}
          </Link>
        </li>
        {!mobile && (
          <li className={style.logoContainer}>
            <Logo className={style.logo} />
          </li>
        )}
        <li
          className={
            location.pathname === "/profile"
              ? style.navButtonActive
              : style.navButton
          }
        >
          <Link to={userData ? "/profile" : "/login"}>
            {mobile ? <ProfileIcon style={style.profileIcon} /> : "Profile"}
          </Link>
        </li>
      </ul>
      {!mobile && !userData && (
        <Button onClick={handleSignIn} className={style.signInButton}>
          Sign-in
        </Button>
      )}
    </nav>
  );
}
Nav.propTypes = {
  setShowSearchBox: PropTypes.func.isRequired,
};

export default Nav;
