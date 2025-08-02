import { Link } from "react-router-dom";
import style from "./Nav.module.css";

const Logo = () => {
  return (
    <svg className={style.svg} width="200" height="200" viewBox="0 0 470 470" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M80.7006 270.881L144.297 207.284C156.013 195.568 175.008 195.568 186.724 207.284L262.515 283.075C274.23 294.79 274.23 313.785 262.515 325.501L186.721 401.295C175.005 413.011 156.01 413.011 144.295 401.295L0 257L33.4101 223.59L80.7006 270.881ZM165.509 355.689L216.908 304.289L165.51 252.89L114.11 304.29L165.509 355.689Z"
        fill="#1A1A1A"/>
      <path
        d="M283.075 68.5014C294.791 56.7857 313.786 56.7857 325.502 68.5014L469.796 212.796L436.386 246.206L389.094 198.914L325.498 262.511C313.782 274.226 294.787 274.226 283.071 262.511L207.282 186.722C195.566 175.006 195.566 156.011 207.282 144.295L283.075 68.5014ZM304.285 216.905L355.685 165.505L304.287 114.107L252.887 165.507L304.285 216.905Z"
        fill="#1A1A1A"/>
    </svg>
  )
}

const Nav = () => {
  return (
    // TODO: wrap everything in a div, move and adjust style.nav to the div and add a Sign-in button
    // TODO: change hover from buttons to another style and yellow supposed to show where you are in the app
    <ul className={style.nav}>
      <Link to="#">
        <li className={style.navButton}>Home</li>
      </Link>
      <Link to="#">
        <li className={style.navButton}>Search</li>
      </Link>
      <li className={style.logo}>
        <Logo />
      </li>
      <Link to="#">
        <li className={style.navButton}>Profile</li>
      </Link>
    </ul>
  );
};

export default Nav;
