import { useState } from "react";
import StatusContext from "../status/StatusContext.js";
import PropTypes from "prop-types";

const StatusContextProvider = ({ children }) => {
  const stateInit = {
    error: "",
    isLoading: false,
  };

  const [status, setStatus] = useState(stateInit);
  const [showSearchBox, setShowSearchBox] = useState(false);

  return (
    <StatusContext.Provider
      value={{ status, setStatus, showSearchBox, setShowSearchBox }}
    >
      {children}
    </StatusContext.Provider>
  );
};

StatusContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StatusContextProvider;
