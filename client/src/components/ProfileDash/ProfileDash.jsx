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
        <Avatar avatar={profile.avatar ?? null} score={score} />
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
              {profile.bio ?? "This user has not set a bio yet."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

ProfileDash.propTypes = {
  size: PropTypes.oneOf(["sm", "lg"]).isRequired,
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
};

export default ProfileDash;
