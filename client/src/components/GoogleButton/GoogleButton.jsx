import { useGoogleLogin } from "@react-oauth/google";
import style from "./GoogleButton.module.css";
import Button from "../Button.jsx";
import useFetch from "../../hooks/useFetch.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../context/user/UserContext.js";
import StatusContext from "../../context/status/StatusContext.js";
import { GoogleIcon } from "../icons/index.js";

function GoogleButton() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const { status, setStatus } = useContext(StatusContext);

  const { performFetch } = useFetch("/login/google-auth", (res) => {
    const { _id: userId, username } = res.user;
    setUser({ userId, username });
    navigate("/home"); // Redirect to landing page on success
  });

  const handleLoginSuccess = async (response) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: response.access_token,
      }),
    };

    performFetch(options);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: (err) => {
      setStatus((prev) => ({ ...prev, error: err?.message }));
    },
  });

  return (
    <Button
      onClick={googleLogin}
      icon={<GoogleIcon style={style.googleLogo} />}
      className={style.googleButton}
      disabled={status.isLoading}
    >
      Continue with Google
    </Button>
  );
}

export default GoogleButton;
