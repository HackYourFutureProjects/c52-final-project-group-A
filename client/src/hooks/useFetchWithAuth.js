import { useState, useRef } from "react";

const useFetchWithAuth = (route, onReceived) => {
  if (route.includes("api/")) {
    throw Error("route must NOT include /api in useFetchWithAuth");
  }

  const controllerRef = useRef(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const cancelFetch = () => {
    controllerRef.current?.abort();
  };

  const performFetch = (options) => {
    setError(null);
    setIsLoading(true);

    controllerRef.current = new AbortController();
    const { signal } = controllerRef.current;

    const baseOptions = {
      method: "GET",
      credentials: "include",
      headers: { "content-type": "application/json" },
      signal,
    };

    (async () => {
      const url = `/api${route}`;
      const res = await fetch(url, { ...baseOptions, ...options });

      let json = {};
      try {
        json = await res.json();
      } catch {
        json = {};
      }

      if (res.ok) {
        onReceived(json);
      } else {
        const msg =
          (Array.isArray(json?.errors) && json.errors.join(", ")) ||
          json?.message ||
          json?.msg ||
          `HTTP ${res.status}`;
        setError(msg);
      }

      setIsLoading(false);
    })().catch((e) => {
      const errorMsg = e?.message || String(e);
      setError(errorMsg);
      setIsLoading(false);
    });
  };

  return { isLoading, error, performFetch, cancelFetch };
};

export default useFetchWithAuth;
