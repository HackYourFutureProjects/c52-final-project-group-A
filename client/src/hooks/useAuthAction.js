import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/user/UserContext";

/**
 * A custom hook to protect actions that require authentication.
 * @returns {function(*): void} A function that takes an action callback.
 * If the user is authenticated, the action is executed.
 * If not, the user is redirected to the /login page.
 */
export default function useAuthAction() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  return (action) => {
    if (user && user.userId) {
      if (action) {
        action();
      }
    } else {
      navigate("/login");
    }
  };
}
