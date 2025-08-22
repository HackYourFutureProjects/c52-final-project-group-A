import { useNavigate } from "react-router-dom";
import styles from "./Fab.module.css";
import PropTypes from "prop-types";
import Button from "../Button.jsx";

export default function Fab({ children }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/new-post");
  };

  return (
    <Button className={styles.fab} onClick={handleClick}>
      {children}
    </Button>
  );
}

Fab.propTypes = {
  children: PropTypes.node,
};
