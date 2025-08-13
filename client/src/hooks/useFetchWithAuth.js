import { useState, useCallback } from "react";

export default function useFetchWithAuth(url, onSuccess) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const performFetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api${url}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
      setData(json);
      if (typeof onSuccess === "function") {
        onSuccess(json);
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [url, onSuccess]);

  const cancelFetch = useCallback(() => {}, []);

  return { data, isLoading, error, performFetch, cancelFetch };
}
