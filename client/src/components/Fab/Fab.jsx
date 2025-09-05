import { useNavigate } from "react-router-dom";
import style from "./Fab.module.css";
import Button from "../Button.jsx";
import PlusIcon from "../icons/PlusIcon.jsx";
import useAuthAction from "../../hooks/useAuthAction.js";

function Fab() {
  const navigate = useNavigate();
  const handleAuthAction = useAuthAction();

  const handleClick = () => {
    handleAuthAction(() => {
      navigate("/new-post");
    });
  };

  return (
    <Button className={style.fab} onClick={handleClick}>
      <PlusIcon style={style.icon} />
    </Button>
  );
}

export default Fab;
