import PropTypes from "prop-types";
import Container from "../UI/Container";

export default function Chip({ userName }) {
  return(
    <Container style="absolute p-5 bg-red-1 text-14 text-red-6 left-[-20px]">
      {userName}
    </Container>
  )
}

Chip.propTypes = {
  userName: PropTypes.string,
};
