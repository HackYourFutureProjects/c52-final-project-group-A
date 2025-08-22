import PropTypes from "prop-types";
import style from "./Drawer.module.css";

function Drawer({ name, value, options, placeholder, onChange }) {
  return (
    <label htmlFor={name} className={style.label}>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={style.input}
      >
        <option value="">{placeholder}</option>
        {options.length > 0 &&
          options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </select>
    </label>
  );
}

Drawer.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Drawer;
