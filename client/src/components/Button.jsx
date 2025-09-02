import PropTypes from "prop-types";

function Button({
  children,
  onClick,
  icon,
  className,
  disabled = false,
  ...props
}) {
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && icon}
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  icon: PropTypes.element,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
