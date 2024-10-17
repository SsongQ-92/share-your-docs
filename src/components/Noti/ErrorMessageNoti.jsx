import PropTypes from "prop-types";

export default function ErrorMessageNoti({ errorText }) {
  return (
    <p className="w-200 p-10 bg-gray-6 text-red text-22 break-words hover:bg-black-light">
      {errorText}
    </p>
  )
}

ErrorMessageNoti.propTypes = {
  errorText: PropTypes.string.isRequired,
}
