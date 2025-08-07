import Button from "../Button.jsx";
import style from "./ProfileDash.module.css";
import PropTypes from "prop-types";
import Avatar from "../Avatar/Avatar.jsx";
import { Link } from "react-router-dom";

function ProfileDash({ size, user }) {
  const { username, profile, score } = user;

  return (
    <section className={style.dash}>
      <div className={style.mainContainer}>
        <Avatar size={size} avatar={profile.avatar} score={score} />
        <div className={style.wrapper}>
          <div className={style.nameAndBtnContainer}>
            <div className={style.nameContainer}>
              <h1 className={style.fullName}>Full Name</h1>
              <p className={style.username}>
                <Link to={`user/${username}`}>@{username}</Link>
              </p>
            </div>
            <Button label="Follow" className={style.followBtn} />
          </div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
            faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi
            pretium tellus duis convallis. Tempus leo eu aenean sed diam urna
            tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
            Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
            hendrerit semper vel class aptent taciti sociosqu. Ad litora
            torquent per conubia nostra inceptos himenaeos.
          </p>
        </div>
      </div>
    </section>
  );
}

ProfileDash.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  user: PropTypes.object,
};

export default ProfileDash;
