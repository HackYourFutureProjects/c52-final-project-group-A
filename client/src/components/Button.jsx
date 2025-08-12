import PropTypes from "prop-types";

function Button({ label, onClick, icon, className, disabled = false }) {
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {icon && icon}
      {label}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
