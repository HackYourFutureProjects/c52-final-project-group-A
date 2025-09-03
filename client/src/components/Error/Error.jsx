import PropTypes from "prop-types";
import style from "./Error.module.css";
import Button from "../Button.jsx";
import { CrossIcon } from "../icons/index.js";
import { useContext } from "react";
import StatusContext from "../../context/status/StatusContext.js";

function Error({ message }) {
  const { setStatus } = useContext(StatusContext);
  return (
    <section className={style.section}>
      <div className={style.headerContainer}>
        <h1 className={style.header}>Error</h1>
        <Button
          className={style.closeBtn}
          onClick={() => setStatus((prev) => ({ ...prev, error: null }))}
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
