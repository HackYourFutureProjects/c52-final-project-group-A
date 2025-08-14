import { useState } from "react";
import styles from "./SearchBox.module.css";

function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/search?q=${query}`);
      const data = await res.json();

      const combined = [...(data.users || []), ...(data.posts || [])];

      setResults(combined);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Search users or posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()} // press Enter to search
        className={styles.searchInput}
      />
      <button onClick={handleSearch} className={styles.searchButton}>
        Search
      </button>

      {/*Search Results */}
      {results.length > 0 && (
        <ul className={styles.resultsList}>
          {results.map((item, index) => (
            <li key={index} className={styles.resultItem}>
              {item.username || item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBox;
