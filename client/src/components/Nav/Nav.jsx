import { Link } from "react-router-dom";
import style from "./Nav.module.css";
import Button from "../Button.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "../../context/user/UserContext.js";
import useWindowWidth from "../../hooks/useWindowWidth.js";
import {
  HomeIcon,
  SearchIcon,
  ProfileIcon,
  LoginIcon,
  Logo,
} from "../icons/index.js";
import PropTypes from "prop-types";
import StatusContext from "../../context/status/StatusContext.js";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = useWindowWidth(768);
  const tablet = useWindowWidth(1115);
  const { user } = useContext(UserContext);
  const { showSearchBox, setShowSearchBox } = useContext(StatusContext);
  const [profileLink, setProfileLink] = useState(null);
  const [scrollPos, setScrollPos] = useState({ y: 0, lastY: 0 });
  const [hideNav, setHideNav] = useState(false);

  useEffect(() => {
    if (!user.username) {
      return setProfileLink("/login");
    }
    setProfileLink(`/user/${user.username}`);
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      if (!mobile) return;
      const y = window.scrollY;
      setScrollPos((prev) => ({ y, lastY: prev.y }));
      scrollPos.y > scrollPos.lastY ? setHideNav(true) : setHideNav(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobile, scrollPos]);

  const handleSignIn = () => {
    navigate("/login");
  };

  return (
    <nav
      className={`${style.navContainer} ${hideNav ? style.navContainerHidden : ""}`}
    >
      <ul className={style.nav}>
        <li
          className={
            location.pathname === "/home"
              ? style.navButtonActive
              : style.navButton
          }
        >
          <Link to={user.userId ? "/home" : "/login"}>
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
              if (user.userId) {
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
            location.pathname === `/user/${user.username}`
              ? style.navButtonActive
              : style.navButton
          }
        >
          <Link to={profileLink}>
            {mobile ? <ProfileIcon style={style.profileIcon} /> : "Profile"}
          </Link>
        </li>
      </ul>
      {!mobile && !user.userId && (
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
