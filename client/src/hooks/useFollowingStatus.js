import { useState, useEffect, useCallback } from "react";

const followingStatusMap = new Map();
const listeners = new Set();

const notifyListeners = (userId, status) => {
  listeners.forEach((listener) => listener(userId, status));
};

export const useFollowingStatus = (userId) => {
  const [isFollowing, setIsFollowing] = useState(
    followingStatusMap.get(userId) || false,
  );

  useEffect(() => {
    const listener = (changedUserId, status) => {
      if (changedUserId === userId) {
        setIsFollowing(status);
      }
    };

    listeners.add(listener);
    return () => listeners.delete(listener);
  }, [userId]);

  const updateFollowingStatus = useCallback(
    (newStatus) => {
      followingStatusMap.set(userId, newStatus);
      setIsFollowing(newStatus);
      notifyListeners(userId, newStatus);
    },
    [userId],
  );

  return { isFollowing, updateFollowingStatus };
};
