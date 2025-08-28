import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import StateContext from "./StateContext.js";
import PropTypes from "prop-types";
import useFetch from "../../hooks/useFetch.js";

const StateContextProvider = ({ children }) => {
  const stateInit = {
    userId: "",
    username: "",
  };

  const [state, setState] = useState(stateInit);
  const [showSearchBox, setShowSearchBox] = useState(false);

  const { performFetch, cancelFetch } = useFetch("/context", (res) => {
    const { userId, username } = res;
    setState((prevState) => ({ ...prevState, userId, username }));
  });

  useEffect(() => {
    const token = Cookies.get("bq_token");
    if (token) {
      performFetch();
    }

    return () => {
      cancelFetch();
    };
  }, []);

  return (
    <StateContext.Provider
      value={{ state, setState, showSearchBox, setShowSearchBox }}
    >
      {children}
    </StateContext.Provider>
  );
};

StateContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StateContextProvider;
