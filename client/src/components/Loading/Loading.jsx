import { HashLoader } from "react-spinners";
import PropTypes from "prop-types";
import style from "./Loading.module.css";

function Loading({ x, y }) {
  // using inline styles because of the limitation of the library/ requirements for reactivity
  return (
    <div className={style.wrapper} style={{ top: y, left: x }}>
      <HashLoader size={30} color="#fe4a22" />
    </div>
  );
}

Loading.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
};

export default Loading;
