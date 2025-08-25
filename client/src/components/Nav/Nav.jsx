import { Link } from "react-router-dom";
import style from "./Nav.module.css";
import Button from "../Button.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Logo from "../Logo.jsx";
import StateContext from "../../context/state/StateContext.js";
import useWindowWidth from "../../hooks/useWindowWidth.js";
import { HomeIcon, SearchIcon, ProfileIcon } from "../icons/index.js";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = useWindowWidth(768);
  const { state } = useContext(StateContext);
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
        <li className={style.navButton}>
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
          Sign-in
        </Button>
      )}
    </nav>
  );
}

export default Nav;
