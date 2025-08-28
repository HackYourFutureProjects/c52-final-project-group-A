import { useNavigate } from "react-router-dom";
import style from "./Fab.module.css";
import Button from "../Button.jsx";
import PlusIcon from "../icons/PlusIcon.jsx";

function Fab() {
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

export default Fab;
