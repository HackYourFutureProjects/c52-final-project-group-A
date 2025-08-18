import { useGoogleLogin } from "@react-oauth/google";
import style from "./GoogleButton.module.css";
import Button from "../Button.jsx";
import useFetch from "../../hooks/useFetch.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserDataContext from "../../context/userDataContext/UserDataContext.js";
import { GoogleIcon } from "../icons/index.js";

function GoogleButton() {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserDataContext);

  const { performFetch, isLoading, error } = useFetch(
    "/login/Google_Auth",
    (res) => {
      setUserData(res.user._doc);
      navigate("/home"); // Redirect to landing page on success
    },
  );

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
    onError: (error) => {
      console.error("Google login error:", error);
    },
  });

  if (error) {
    console.error("Fetch error:", error);
  }

  return (
    <Button
      onClick={googleLogin}
      icon={<GoogleIcon style={style.googleLogo} />}
      className={style.googleButton}
      disabled={isLoading}
    >
      {isLoading ? "Signing in..." : "Continue with Google"}
    </Button>
  );
}

export default GoogleButton;
