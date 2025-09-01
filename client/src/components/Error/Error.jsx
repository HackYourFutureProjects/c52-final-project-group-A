import PropTypes from "prop-types";
import style from "./Error.module.css";
import Button from "../Button.jsx";
import { CrossIcon } from "../icons/index.js";
import { useContext } from "react";
import stateContext from "../../context/state/StateContext.js";

function Error({ message }) {
  const { setState } = useContext(stateContext);
  return (
    <section className={style.section}>
      <div className={style.headerContainer}>
        <h1 className={style.header}>Error</h1>
        <Button
          className={style.closeBtn}
          onClick={() => setState((prev) => ({ ...prev, error: "" }))}
        >
          <CrossIcon style={style.crossIcon} />
        </Button>
      </div>
      <p className={style.message}>{message}</p>
    </section>
  );
}

Error.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Error;
