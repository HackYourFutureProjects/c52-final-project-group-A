import { useState, useEffect, useCallback, useContext } from "react";
import UserContext from "../context/user/UserContext.js";

const followingStatusMap = new Map();
const listeners = new Set();

const notifyListeners = (userId, status) => {
  listeners.forEach((listener) => listener(userId, status));
};

export const useFollowingStatus = (userId) => {
  const { user } = useContext(UserContext);

  const [isFollowing, setIsFollowing] = useState(
    user.userId ? followingStatusMap.get(userId) || false : false,
  );

  useEffect(() => {
    if (!user.userId) {
      setIsFollowing(false);
      followingStatusMap.clear();
    }

    const listener = (changedUserId, status) => {
      if (changedUserId === userId) {
        setIsFollowing(status);
      }
    };

    listeners.add(listener);
    return () => listeners.delete(listener);
  }, [userId, user.userId]);

  const updateFollowingStatus = useCallback(
    (newStatus) => {
      if (!user.userId) return;

      followingStatusMap.set(userId, newStatus);
      setIsFollowing(newStatus);
      notifyListeners(userId, newStatus);
    },
    [userId, user.userId],
  );

  return { isFollowing, updateFollowingStatus };
};
