import { useState, useEffect, useCallback, useContext } from "react";
import StateContext from "../context/state/StateContext";

const followingStatusMap = new Map();
const listeners = new Set();

const notifyListeners = (userId, status) => {
  listeners.forEach((listener) => listener(userId, status));
};

export const useFollowingStatus = (userId) => {
  const { state } = useContext(StateContext);

  const [isFollowing, setIsFollowing] = useState(
    state.userId ? followingStatusMap.get(userId) || false : false,
  );

  useEffect(() => {
    if (!state.userId) {
      setIsFollowing(false);
    }

    const listener = (changedUserId, status) => {
      if (changedUserId === userId) {
        setIsFollowing(status);
      }
    };

    listeners.add(listener);
    return () => listeners.delete(listener);
  }, [userId, state.userId]);

  const updateFollowingStatus = useCallback(
    (newStatus) => {
      if (!state.userId) return;

      followingStatusMap.set(userId, newStatus);
      setIsFollowing(newStatus);
      notifyListeners(userId, newStatus);
    },
    [userId, state.userId],
  );

  return { isFollowing, updateFollowingStatus };
};
