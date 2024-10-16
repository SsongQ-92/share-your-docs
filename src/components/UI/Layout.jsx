import PropTypes from "prop-types";
import Header from "../Header";

export default function Layout({ children }) {
  return (
    <main className="w-full h-screen flex flex-col bg-black-dark">
      <Header />
      {children}
    </main>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
};
