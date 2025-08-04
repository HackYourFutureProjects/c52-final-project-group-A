import PropTypes from "prop-types";

function Button({ label, onClick, icon, className, disabled = false }) {
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {icon && <span>{icon}</span>}
      {label}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.element,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
