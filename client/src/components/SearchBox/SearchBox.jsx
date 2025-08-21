import { useState, useEffect, useCallback } from "react";
import styles from "./SearchBox.module.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";

export default function SearchBox({ onClose }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("user");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const onReceived = useCallback(
    (data) => {
      // Use a callback with setResults to get the latest `type`
      setResults(() => {
        return type === "user" ? data.users || [] : data.posts || [];
      });
    },
    [type],
  );

  const { isLoading, error, performFetch, cancelFetch } = useFetch(
    `/search?q=${encodeURIComponent(query)}&type=${type}`,
    onReceived,
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        performFetch();
      } else {
        setResults([]);
      }
    }, 500);

    return () => {
      clearTimeout(delayDebounce);
      cancelFetch();
    };
  }, [query, type]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query, type]);

  const handleNavigate = useCallback(
    (item) => {
      const route = type === "user" ? `/user/${item._id}` : `/post/${item._id}`;
      navigate(route);
      onClose();
    },
    [navigate, onClose, type],
  );

  const isRealError = error && error.name !== "AbortError";

  return (
    <div className={styles.searchBoxContainer}>
      <div className={styles.searchGroup}>
        <select
          className={styles.searchTypeSelect}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="post">Posts</option>
          <option value="user">Users</option>
        </select>

        <input
          type="text"
          className={styles.searchInput}
          placeholder={`Search ${type}s...`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (selectedIndex >= 0 && results[selectedIndex]) {
                handleNavigate(results[selectedIndex]);
              } else if (query.trim()) {
                performFetch();
              }
            } else if (e.key === "ArrowDown") {
              setSelectedIndex((prev) =>
                Math.min(prev + 1, results.length - 1),
              );
            } else if (e.key === "ArrowUp") {
              setSelectedIndex((prev) => Math.max(prev - 1, 0));
            }
          }}
        />
      </div>

      <button
        className={styles.searchBoxButton}
        onClick={() => {
          if (query.trim()) {
            performFetch();
          }
        }}
      >
        🔍
      </button>
      <button className={styles.closeButton} onClick={onClose}>
        ✕
      </button>

      {isLoading && <div className={styles.loading}>Loading...</div>}
      {isRealError && (
        <div className={styles.error}>Error: {error.toString()}</div>
      )}

      {results.length > 0 && (
        <ul className={styles.suggestionsList}>
          {results.map((item, index) => (
            <li
              key={type === "user" ? item.username : item.slug || item._id}
              className={`${styles.suggestionItem} ${
                index === selectedIndex ? styles.active : ""
              }`}
              onClick={() => handleNavigate(item)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleNavigate(item);
                }
              }}
              role="button"
            >
              {type === "user"
                ? (() => {
                    const first = item.profile?.first_name || "";
                    const last = item.profile?.last_name || "";
                    const fullName = [first, last].filter(Boolean).join(" ");
                    return `${item.username}${
                      fullName ? ` (${fullName})` : ""
                    }`;
                  })()
                : `${item.title} - ${
                    Array.isArray(item.tags) ? item.tags.join(", ") : ""
                  }`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

SearchBox.propTypes = {
  onClose: PropTypes.func.isRequired,
};
