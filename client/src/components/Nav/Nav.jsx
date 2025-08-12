import { Link } from "react-router-dom";
import style from "./Nav.module.css";
import Button from "../Button.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import Logo from "../Logo.jsx";
import UserDataContext from "../../context/userDataContext/UserDataContext.js";
import useWindowWidth from "../../hooks/useWindowWidth.js";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const mobile = useWindowWidth(768);
  const { userData } = useContext(UserDataContext);

  const HomeIcon = () => {
    return (
      <svg
        className={style.homeIcon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M20 17.0002V11.4522C20 10.9179 19.9995 10.6506 19.9346 10.4019C19.877 10.1816 19.7825 9.97307 19.6546 9.78464C19.5102 9.57201 19.3096 9.39569 18.9074 9.04383L14.1074 4.84383C13.3608 4.19054 12.9875 3.86406 12.5674 3.73982C12.1972 3.63035 11.8026 3.63035 11.4324 3.73982C11.0126 3.86397 10.6398 4.19014 9.89436 4.84244L5.09277 9.04383C4.69064 9.39569 4.49004 9.57201 4.3457 9.78464C4.21779 9.97307 4.12255 10.1816 4.06497 10.4019C4 10.6506 4 10.9179 4 11.4522V17.0002C4 17.932 4 18.3978 4.15224 18.7654C4.35523 19.2554 4.74432 19.6452 5.23438 19.8482C5.60192 20.0005 6.06786 20.0005 6.99974 20.0005C7.93163 20.0005 8.39808 20.0005 8.76562 19.8482C9.25568 19.6452 9.64467 19.2555 9.84766 18.7654C9.9999 18.3979 10 17.932 10 17.0001V16.0001C10 14.8955 10.8954 14.0001 12 14.0001C13.1046 14.0001 14 14.8955 14 16.0001V17.0001C14 17.932 14 18.3979 14.1522 18.7654C14.3552 19.2555 14.7443 19.6452 15.2344 19.8482C15.6019 20.0005 16.0679 20.0005 16.9997 20.0005C17.9316 20.0005 18.3981 20.0005 18.7656 19.8482C19.2557 19.6452 19.6447 19.2554 19.8477 18.7654C19.9999 18.3978 20 17.932 20 17.0002Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    );
  };
  const SearchIcon = () => {
    return (
      <svg
        className={style.searchIcon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M15 15L21 21M10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10C17 13.866 13.866 17 10 17Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    );
  };
  const ProfileIcon = () => {
    return (
      <svg
        className={style.profileIcon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            d="M17.2166 19.3323C15.9349 17.9008 14.0727 17 12 17C9.92734 17 8.06492 17.9008 6.7832 19.3323M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    );
  };

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
          <Link to="/home">{mobile ? <HomeIcon /> : "Home"}</Link>
        </li>
        <li className={style.navButton}>
          <Link to="#">{mobile ? <SearchIcon /> : "Search"}</Link>
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
          <Link to="/profile">{mobile ? <ProfileIcon /> : "Profile"}</Link>
        </li>
      </ul>
      {!mobile && !userData && (
        <Button
          label="Sign-in"
          onClick={handleSignIn}
          className={style.signInButton}
        />
      )}
    </nav>
  );
}

export default Nav;
