import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import StateContext from "../context/state/StateContext";

/**
 * Custom hook that provides a function to handle authentication-based redirects
 * If the user is not authenticated, they will be redirected to the login page
 * @param {string} [returnPath] - Optional path to return to after login
 * @returns {Object} - Object containing redirectIfNotAuth function and authentication state
 */
const useAuthRedirect = (returnPath = null) => {
  const { state } = useContext(StateContext);
  const navigate = useNavigate();
  const isAuthenticated = Boolean(state.userId);

  /**
   * Redirects to login if user is not authenticated
   * @param {Event} [event] - Optional event to prevent default behavior
   * @param {string} [customReturnPath] - Optional custom return path that overrides the default
   * @returns {boolean} - Returns true if user is authenticated, false otherwise
   */
  const redirectIfNotAuth = (event, customReturnPath = null) => {
    if (event) {
      event.preventDefault();
    }

    if (!isAuthenticated) {
      const path = customReturnPath || returnPath || window.location.pathname;
      navigate("/login", { state: { from: path } });
      return false;
    }

    return true;
  };

  return {
    redirectIfNotAuth,
    isAuthenticated,
  };
};

export default useAuthRedirect;
