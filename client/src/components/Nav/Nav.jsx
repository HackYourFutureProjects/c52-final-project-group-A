import { Link } from "react-router-dom";
import style from "./Nav.module.css";
import Button from "../Button.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import StateContext from "../../context/state/StateContext.js";
import useWindowWidth from "../../hooks/useWindowWidth.js";
import {
  HomeIcon,
  SearchIcon,
  ProfileIcon,
  LoginIcon,
  Logo,
} from "../icons/index.js";
import PropTypes from "prop-types";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = useWindowWidth(768);
  const tablet = useWindowWidth(1115);
  const { state, showSearchBox, setShowSearchBox } = useContext(StateContext);
  const [profileLink, setProfileLink] = useState(null);

  useEffect(() => {
    if (!state.username) {
      return setProfileLink("/login");
    }
    setProfileLink(`/user/${state.username}`);
  }, [state]);

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
          <Link to={state.userId ? "/home" : "/login"}>
            {mobile ? <HomeIcon style={style.homeIcon} /> : "Home"}
          </Link>
        </li>
        <li
          className={`${style.navButton} ${
            showSearchBox ? style.navButtonActive : ""
          }`}
        >
          <Button
            onClick={() => {
              if (state.userId) {
                setShowSearchBox((prev) => !prev);
              }
            }}
          >
            {mobile ? <SearchIcon style={style.searchIcon} /> : "Search"}
          </Button>
        </li>

        {!mobile && (
          <li className={style.logoContainer}>
            <Logo style={style.logo} />
          </li>
        )}
        <li
          className={
            location.pathname === `/user/${state.username}`
              ? style.navButtonActive
              : style.navButton
          }
        >
          <Link to={profileLink}>
            {mobile ? <ProfileIcon style={style.profileIcon} /> : "Profile"}
          </Link>
        </li>
      </ul>
      {!mobile && !state.userId && (
        <Button onClick={handleSignIn} className={style.signInButton}>
          {!tablet ? "Sign-in" : <LoginIcon style={style.loginIcon} />}
        </Button>
      )}
    </nav>
  );
}
Nav.propTypes = {
  setShowSearchBox: PropTypes.func.isRequired,
  showSearchBox: PropTypes.bool.isRequired,
};
export default Nav;
