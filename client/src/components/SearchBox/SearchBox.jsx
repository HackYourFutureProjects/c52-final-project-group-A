import { useState, useEffect, useCallback } from "react";
import styles from "./SearchBox.module.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function SearchBox({ onClose }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("user"); // default to 'user'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleNavigate = useCallback(
    (item) => {
      const route = type === "user" ? `/user/${item._id}` : `/post/${item._id}`;
      navigate(route);
      onClose();
    },
    [navigate, onClose, type],
  );

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=${type}`,
      );
      const data = await res.json();
      if (res.ok) {
        setResults(type === "user" ? data.users : data.posts);
      } else {
        console.error("Search error:", data.message || "No message");
        setResults([]);
      }
    } catch (jsonErr) {
      console.error("JSON parse error:", jsonErr);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [query, type]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) handleSearch();
      else setResults([]);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, type, handleSearch]);
  //Reset selection when query or type changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query, type]);

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
              } else {
                handleSearch();
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

      <button className={styles.searchBoxButton} onClick={handleSearch}>
        🔍
      </button>
      <button className={styles.closeButton} onClick={onClose}>
        ✕
      </button>

      {loading && <div className={styles.loading}>Loading...</div>}

      {results.length > 0 && (
        <ul className={styles.suggestionsList}>
          {results.map((item, index) => (
            <li
              key={type === "user" ? item.username : item.slug || item._id}
              className={`${styles.suggestionItem} ${index === selectedIndex ? styles.active : ""}`}
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
                    return `${item.username}${fullName ? ` (${fullName})` : ""}`;
                  })()
                : `${item.title} - ${(Array.isArray(item.tags) ? item.tags : []).join(", ")}`}
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
