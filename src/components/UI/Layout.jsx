import PropTypes from "prop-types";

export default function Layout({ children }) {
  return <main className="w-full h-screen flex flex-col">{children}</main>
}

Layout.propTypes = {
  children: PropTypes.node,
};
