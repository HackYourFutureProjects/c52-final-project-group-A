import Button from "../Button.jsx";
import style from "./ProfileDash.module.css";

function ProfileDash() {
  return (
    <div className={style.dash}>
      <div className={style.wrapper}>
        <div className={style.avatarContainer}>
          <img src="/avatar_placeholder.png" alt="avatar" />
          <span className={style.score}>00</span>
        </div>
        <div>
          <h1>Full Name</h1>
          <p className={style.username}>@username</p>
        </div>
      </div>
      <Button label="Follow" className={style.followBtn} />
    </div>
  );
}

export default ProfileDash;
