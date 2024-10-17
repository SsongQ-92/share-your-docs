import PropTypes from "prop-types";
import Container from "../UI/Container";

export default function Chip({ userName }) {
  return(
    <Container style="absolute max-w-40 p-5 bg-red-1 text-14 text-red-6 left-[-35px] top-2 z-toast">
      {userName.length > 3 ? userName.slice(0, 3) + "..." : userName}
    </Container>
  )
}

Chip.propTypes = {
  userName: PropTypes.string,
};
