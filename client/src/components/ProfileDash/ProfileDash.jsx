import Button from "../Button.jsx";
import style from "./ProfileDash.module.css";
import PropTypes from "prop-types";
import Avatar from "../Avatar/Avatar.jsx";
import { Link } from "react-router-dom";

function ProfileDash({ size, user }) {
  const dashSize = style[`dash_${size}`];
  const followBtnSize = style[`followBtn_${size}`];
  const username = user?.username ?? "username";
  const score = user?.score ?? "00";
  const profile = user?.profile ?? { first_name: "Full", last_name: "Name" };
  const fullName = profile.first_name + " " + profile.last_name;

  return (
    <section className={style.dash + " " + dashSize}>
      <div className={style.mainContainer}>
        <Avatar score={score} />
        <div className={style.wrapper}>
          <div className={style.nameAndBtnContainer}>
            <div className={style.nameContainer}>
              <h1 className={style.fullName}>{fullName}</h1>
              <Link to={`../user/${username}`} className={style.username}>
                @{username}
              </Link>
            </div>
            <Button
              label="Follow"
              className={style.followBtn + " " + followBtnSize}
            />
          </div>
          {size === "lg" && (
            <p className={style.bio}>
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
              faucibus ex sapien vitae pellentesque sem placerat. In id cursus
              mi pretium tellus duis convallis. Tempus leo eu aenean sed diam
              urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum
              egestas. Iaculis massa nisl malesuada lacinia integer nunc
              posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad
              litora torquent per conubia nostra inceptos himenaeos.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

ProfileDash.propTypes = {
  size: PropTypes.oneOf(["sm", "lg"]).isRequired,
  user: PropTypes.object,
};

export default ProfileDash;
