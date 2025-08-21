import { useGoogleLogin } from "@react-oauth/google";
import style from "./GoogleButton.module.css";
import Button from "../Button.jsx";
import useFetch from "../../hooks/useFetch.js";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import StateContext from "../../context/state/StateContext.js";
import { GoogleIcon } from "../icons/index.js";

function GoogleButton() {
  const navigate = useNavigate();
  const { setState } = useContext(StateContext);

  const { performFetch, isLoading, error } = useFetch(
    "/login/Google_Auth",
    (res) => {
      const { _id: userId, username } = res.user;
      if (!userId || !username) {
        console.error("Invalid user data:", res.user);
        return;
      }
      setState({ userId, username });
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
