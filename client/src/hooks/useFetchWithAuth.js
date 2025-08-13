// client/src/hooks/useFetchWithAuth.js
import { useState, useCallback, useRef } from "react";

export default function useFetchWithAuth(url, onSuccess) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const performFetch = useCallback(
    async (options = {}) => {
      if (!url) return; // ⬅️ важная защита

      // отменяем предыдущий незавершённый запрос
      if (abortControllerRef.current) abortControllerRef.current.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api${url}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          ...options,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);

        setData(json);
        onSuccess?.(json);
      } catch (err) {
        if (err?.name === "AbortError") return;
        setError(err);
      } finally {
        abortControllerRef.current = null;
        setIsLoading(false);
      }
    },
    [url, onSuccess],
  );

  const cancelFetch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  return { data, isLoading, error, performFetch, cancelFetch };
}
