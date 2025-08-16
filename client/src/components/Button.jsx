import PropTypes from "prop-types";

function Button({ children, onClick, icon, className, disabled = false }) {
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {icon && icon}
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
