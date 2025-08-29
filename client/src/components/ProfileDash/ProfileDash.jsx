import Button from "../Button.jsx";
import style from "./ProfileDash.module.css";
import PropTypes from "prop-types";
import Avatar from "../Avatar/Avatar.jsx";
import { Link } from "react-router-dom";
import useWindowWidth from "../../hooks/useWindowWidth.js";
import { useEffect } from "react";
import useFetch from "../../hooks/useFetch.js";
import { useFollowingStatus } from "../../hooks/useFollowingStatus.js";

function ProfileDash({
  size,
  user,
  className,
  border = "full",
  followBtn = true,
}) {
  const mobile = useWindowWidth(768);
  const { isFollowing, updateFollowingStatus } = useFollowingStatus(user?._id);

  const dashSize =
    mobile && size === "lg" ? style[`dash_mobile`] : style[`dash_${size}`];
  const nameAndBtnContainer = style[`nameAndBtnContainer_${size}`];
  const followBtnSize = style[`followBtn_${size}`];

  const username = user?.username ?? "username";
  let score = user?.score ?? "00";
  const profile = user?.profile ?? { first_name: "Full", last_name: "Name" };
  const fullName = profile.first_name + " " + profile.last_name;

  score = score.toString().padStart(2, "0");

  // Hook for checking follow status
  const { performFetch: checkFollowStatus } = useFetch(
    "/following/check",
    (response) => {
      updateFollowingStatus(response.isFollowing);
    },
  );

  // Hook for follow/unfollow actions
  const { performFetch: toggleFollow } = useFetch("/following", () => {
    updateFollowingStatus(!isFollowing);
  });

  // Check follow status when component loads
  useEffect(() => {
    if (followBtn && user?._id) {
      checkFollowStatus({
        method: "POST",
        body: JSON.stringify({ authorId: user._id }),
      });
    }
  }, [user?._id, followBtn]);

  const handleFollowClick = () => {
    if (!user?._id) return;

    toggleFollow({
      method: "POST",
      body: JSON.stringify({ authorId: user._id }),
    });
  };

  return (
    <article
      className={[style.dash, dashSize, style[`border_${border}`], className]
        .filter(Boolean)
        .join(" ")}
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
                className={style.followBtn + " " + followBtnSize}
                onClick={handleFollowClick}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>
          {size === "lg" && (
            <p className={style.bio}>
              {profile.bio ?? "This user has not set a bio yet."}
            </p>
          )}
        </div>
      </div>
      {size === "md" && (
        <p className={style.bio}>
          {profile.bio ?? "This user has not set a bio yet."}
        </p>
      )}
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
  className: PropTypes.string,
  border: PropTypes.oneOf(["full", "bottom"]),
  followBtn: PropTypes.bool,
};

export default ProfileDash;
