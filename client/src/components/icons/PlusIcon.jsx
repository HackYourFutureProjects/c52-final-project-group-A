import PropTypes from "prop-types";

function PlusIcon({ style }) {
  return (
    <svg
      className={style}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Edit / Add_Plus">
        <path
          id="Vector"
          d="M6 12H12M12 12H18M12 12V18M12 12V6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

PlusIcon.propTypes = {
  style: PropTypes.string,
};

export default PlusIcon;
