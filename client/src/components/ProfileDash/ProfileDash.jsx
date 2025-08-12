import Button from "../Button.jsx";
import style from "./ProfileDash.module.css";
import PropTypes from "prop-types";
import Avatar from "../Avatar/Avatar.jsx";
import { Link } from "react-router-dom";
import useWindowWidth from "../../hooks/useWindowWidth.js";

function ProfileDash({ size, user, border = "full", followBtn = true }) {
  const mobile = useWindowWidth(768);

  const dashSize =
    mobile && size === "lg" ? style[`dash_mobile`] : style[`dash_${size}`];
  const nameAndBtnContainer = style[`nameAndBtnContainer_${size}`];
  const followBtnSize = style[`followBtn_${size}`];

  const username = user?.username ?? "username";
  const score = user?.score ?? "00";
  const profile = user?.profile ?? { first_name: "Full", last_name: "Name" };
  const fullName = profile.first_name + " " + profile.last_name;

  return (
    <article
      className={style.dash + " " + dashSize + " " + style[`border_${border}`]}
    >
      <div className={style.mainContainer}>
        <Avatar avatar={profile.avatar ?? null} score={score} />
        <div className={style.wrapper}>
          <div
            className={style.nameAndBtnContainer + " " + nameAndBtnContainer}
          >
            <header className={style.nameContainer}>
              <h1 className={style.fullName}>{fullName}</h1>
              <Link to={`../user/${username}`} className={style.username}>
                @{username}
              </Link>
            </header>
            {followBtn && (
              <Button
                label="Follow"
                className={style.followBtn + " " + followBtnSize}
              />
            )}
          </div>
          {size === "lg" && (
            <p className={style.bio}>
              {profile.bio ?? "This user has not set a bio yet."}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

ProfileDash.propTypes = {
  size: PropTypes.oneOf(["sm", "md", "lg"]).isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string,
    username: PropTypes.string,
    profile: {
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      avatar: PropTypes.string,
      bio: PropTypes.string,
      _id: PropTypes.string,
    },
    score: PropTypes.number,
  }),
  border: PropTypes.oneOf(["full", "bottom"]),
  followBtn: PropTypes.bool,
};

export default ProfileDash;
