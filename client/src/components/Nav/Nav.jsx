import { Link } from "react-router-dom";
import style from "./Nav.module.css";
import Button from "../Button.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "../Logo.jsx";
import HomeIcon from "../HomeIcon.jsx";
import SearchIcon from "../SearchIcon.jsx";
import ProfileIcon from "../ProfileIcon.jsx";

function Nav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobile, setMobile] = useState(false);

  const handleSignIn = () => {
    navigate("/login");
  };

  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={style.navContainer}>
      <ul className={style.nav}>
        <li
          className={
            location.pathname === "/" ? style.navButtonActive : style.navButton
          }
        >
          <Link to="/">{mobile ? <HomeIcon /> : "Home"}</Link>
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
      {!mobile && (
        <Button
          label="Sign-in"
          onClick={handleSignIn}
          className={style.signInButton}
        />
      )}
    </div>
  );
}

export default Nav;
