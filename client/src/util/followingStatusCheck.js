import useFetch from "../hooks/useFetch.js";

export const useFollowingStatus = (authorId) => {
  const { isLoading, error, performFetch } = useFetch(
    "following/check",
    (response) => {
      return response.isFollowing;
    },
  );

  const checkStatus = () => {
    if (authorId) {
      performFetch({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ authorId }),
      });
    }
  };

  return { isLoading, error, checkStatus };
};
