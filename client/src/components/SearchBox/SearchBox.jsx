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
    let text = "";
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&type=${type}`,
      );
      text = await res.text(); // get raw body text
      const data = JSON.parse(text); // manually parse
      if (res.ok) {
        setResults(type === "user" ? data.users : data.posts);
      } else {
        console.error("Search error:", data.message || "No message");
        setResults([]);
      }
    } catch (jsonErr) {
      console.error("Failed to parse JSON response:", text);
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
      setLoading(false);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, type, handleSearch]);

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
            if (e.key === "Enter") handleSearch();
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
              key={index}
              className={styles.suggestionItem}
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
                ? `${item.username} (${item.profile?.first_name || ""} ${item.profile?.last_name || ""})`
                : `${item.title} - ${item.tags?.join(", ")}`}
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
