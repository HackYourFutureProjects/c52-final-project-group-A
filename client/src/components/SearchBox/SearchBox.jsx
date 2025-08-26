import { useState, useEffect, useCallback } from "react";
import style from "./SearchBox.module.css";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Button from "../Button";
import { SearchIcon } from "../icons/index.js";

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
      const route =
        type === "user" ? `/user/${item.username}` : `/post/${item._id}`;
      navigate(route);
      onClose();
    },
    [navigate, onClose, type],
  );

  const isRealError = error && error.name !== "AbortError";

  return (
    <div className={style.searchBoxContainer}>
      <div className={style.searchGroup}>
        <Button
          className={style.typeSwitch}
          onClick={() => setType((prev) => (prev === "user" ? "post" : "user"))}
        >
          {type}
        </Button>
        <input
          name="searchInput"
          type="text"
          className={style.searchInput}
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
              e.preventDefault();
              setSelectedIndex((prev) =>
                Math.min(prev + 1, results.length - 1),
              );
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setSelectedIndex((prev) => Math.max(prev - 1, -1));
            }
          }}
        />
      </div>

      <Button
        className={style.searchBoxBtn}
        onClick={() => {
          if (query.trim()) {
            performFetch();
          }
        }}
      >
        <SearchIcon style={style.searchIcon} />
      </Button>

      {isLoading && <div className={style.loading}>Loading...</div>}
      {isRealError && (
        <div className={style.error}>Error: {error.toString()}</div>
      )}

      {results.length > 0 && (
        <ul className={style.suggestionsList}>
          {results.map((item, index) => (
            <li
              key={item._id}
              className={`${style.suggestionItem} ${
                index === selectedIndex ? style.active : ""
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
