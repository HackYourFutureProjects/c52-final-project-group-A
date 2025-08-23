import style from "./TextArea.module.css";
import PropTypes from "prop-types";

function TextArea({ name, placeholder, value, onChange, required }) {
  return (
    <label htmlFor={name} className={style.textArea}>
      <textarea
        id={name}
        name={name}
        rows={10}
        value={value}
        onChange={onChange}
        required={required}
        className={style.input}
      />
      <span className={style.placeholder}>{placeholder}</span>
    </label>
  );
}

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
};

export default TextArea;
