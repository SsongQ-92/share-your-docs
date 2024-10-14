import PropTypes from "prop-types";

export default function Layout({ children }) {
  return <main className="w-full h-screen flex flex-col bg-black-dark">{children}</main>
}

Layout.propTypes = {
  children: PropTypes.node,
};
