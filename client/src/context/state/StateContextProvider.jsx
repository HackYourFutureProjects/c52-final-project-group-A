import { useEffect, useState, useRef } from "react";
import StateContext from "./StateContext.js";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import useFetch from "../../hooks/useFetch.js";

const StateContextProvider = ({ children }) => {
  const stateInit = {
    userId: "",
    username: "",
  };

  const [state, setState] = useState(stateInit);
  const lastCookie = useRef(Cookies.get("bq_token"));
  const { performFetch, cancelFetch } = useFetch("/context", (res) => {
    const { userId, username } = res;
    setState({ userId, username });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const currentCookie = Cookies.get("bq_token");
      if (currentCookie && currentCookie !== lastCookie.current) {
        lastCookie.current = currentCookie;
        performFetch({ credentials: "include" });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      cancelFetch && cancelFetch();
    };
  }, []);

  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
};

StateContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StateContextProvider;
