import style from "./InputField.module.css";
import PropTypes from "prop-types";

function InputField({
  name,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
  required,
  ...props
}) {
  return (
    <label htmlFor={name} className={style.label}>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        className={style.input}
        {...props}
      />
      <span className={style.placeholder}>{placeholder}</span>
    </label>
  );
}

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  autoComplete: PropTypes.string,
  required: PropTypes.bool,
};

export default InputField;
