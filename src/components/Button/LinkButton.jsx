import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function LinkButton({ destination, style, children }) {
  return (
    <Link to={`${destination}`}>
      <button className={`flex-center w-200 h-50 border-2 border-solid border-white bg-gray-8 rounded-[15px] text-white text-18 hover:bg-black-light ${style}`}>{children}</button>
    </Link>
  )
}

LinkButton.propTypes = {
  destination: PropTypes.string.isRequired,
  style: PropTypes.string,
  children: PropTypes.node,
};
