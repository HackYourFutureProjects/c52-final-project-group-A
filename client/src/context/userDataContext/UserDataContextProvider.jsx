import { useState } from "react";
import UserDataContext from "./UserDataContext.js";
import PropTypes from "prop-types";

const UserDataContextProvider = ({ children }) => {
  const [userData, setUserData] = useState();

  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
};

UserDataContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserDataContextProvider;
