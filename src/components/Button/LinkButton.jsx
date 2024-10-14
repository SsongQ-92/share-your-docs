import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function LinkButton({ destination, text }) {
  return (
    <Link to={`${destination}`}>
      <button className="flex-center w-200 h-50 border-2 border-solid border-white bg-gray-8 rounded-[15px] text-white text-18 hover:bg-black-light">{text}</button>
    </Link>
  )
}

LinkButton.propTypes = {
  destination: PropTypes.string.isRequired,
  text: PropTypes.string,
};
