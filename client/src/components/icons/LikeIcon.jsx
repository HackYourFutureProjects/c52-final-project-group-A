import PropTypes from "prop-types";

const LikeIcon = ({ style, fill = false }) => {
  return (
    <svg
      className={style}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Interface / Heart_01">
        <path
          id="Vector"
          d="M12 7.69431C10 2.99988 3 3.49988 3 9.49991C3 15.4999 12 20.5001 12 20.5001C12 20.5001 21 15.4999 21 9.49991C21 3.49988 14 2.99988 12 7.69431Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={fill ? "currentColor" : "none"}
        />
      </g>
    </svg>
  );
};

LikeIcon.propTypes = {
  style: PropTypes.string,
  fill: PropTypes.bool,
};

export default LikeIcon;
