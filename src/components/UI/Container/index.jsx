import PropTypes from "prop-types";

export default function Container({ style, children }) {
  return <div className={style}>{children}</div>
}

Container.propTypes = {
  style: PropTypes.string,
  children: PropTypes.node,
};
