import { useContext, useEffect } from "react";
import StateContext from "../context/state/StateContext.js";

const useSetError = (error) => {
  const { setState } = useContext(StateContext);

  useEffect(() => {
    if (error && error.message) {
      setState((prev) => ({ ...prev, error: error?.message }));
    }
  }, [error, setState]);
};

export default useSetError;
