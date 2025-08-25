import { useNavigate } from "react-router-dom";
import style from "./Fab.module.css";
import PropTypes from "prop-types";
import Button from "../Button.jsx";
import PlusIcon from "../icons/PlusIcon.jsx";

export default function Fab() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/new-post");
  };

  return (
    <Button className={style.fab} onClick={handleClick}>
      <PlusIcon style={style.icon} />
    </Button>
  );
}

Fab.propTypes = {
  children: PropTypes.node,
};
