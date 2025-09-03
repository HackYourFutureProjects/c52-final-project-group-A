import { useEffect, useState } from "react";
import UserContext from "./UserContext.js";
import PropTypes from "prop-types";
import useFetch from "../../hooks/useFetch.js";

const UserContextProvider = ({ children }) => {
  const userInit = {
    userId: "",
    username: "",
  };

  const [user, setUser] = useState(userInit);

  const { performFetch, cancelFetch } = useFetch("/context", (res) => {
    const { userId, username } = res;
    setUser({ userId, username });
  });

  useEffect(() => {
    performFetch();

    return () => {
      cancelFetch();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserContextProvider;
