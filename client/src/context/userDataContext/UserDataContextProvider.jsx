import { useState } from "react";
import userDataContext from "./userDataContext";
import PropTypes from "prop-types";

const UserDataContextProvider = ({ children }) => {
  const [userData, setUserData] = useState();

  return (
    <userDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </userDataContext.Provider>
  );
};

UserDataContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserDataContextProvider;
