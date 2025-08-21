import { useNavigate } from "react-router-dom";
import styles from "./Fab.module.css";
import PropTypes from "prop-types";

export default function Fab({ children }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/new-post");
  };

  return (
    <button className={styles.fab} onClick={handleClick}>
      {children}
    </button>
  );
}

Fab.propTypes = {
  children: PropTypes.node,
};
