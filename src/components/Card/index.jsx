import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import getDate from "../../utils/getDate";
import changeDayFormat from "../../utils/changeDayFormat";

export default function Card({ id, title, contents, parsedDate }) {
  const firstLine = contents[0].value;
  const { currentYear, currentMonth, currentDate, currentDay, currentHour, currentMinute } = getDate(parsedDate);


  return (
    <div className="flex flex-col items-start justify-center gap-5 w-full border-2 border-solid border-red-1 rounded-[15px] px-20 py-10">
      <p className="flex items-center gap-10">
        <span className="text-red-1 text-20">1️⃣ Link: </span>
        <Link to={`/docs/${id}`}>
          <span className="text-white text-18 underline">http://localhost:5173/docs/{id}</span>
        </Link>
        {title}
      </p>
      <p className="flex items-center gap-10">
        <span className="text-red-1 text-20">2️⃣ Title: </span>
        <span className="text-white text-18">{title}</span>
      </p>
      <p className="flex items-center gap-10">
        <span className="text-red-1 text-20">3️⃣ First line: </span>
        <span className="text-white text-18">
          {firstLine.length > 29 ? firstLine.slice(0, 30) + "..." : firstLine}
        </span>
      </p>
      <p className="flex items-center gap-10">
        <span className="text-red-1 text-20">4️⃣ Date: </span>
        <span className="text-white text-18">{currentYear}년 {currentMonth}월 {currentDate}일 {changeDayFormat(currentDay)} {currentHour}시 {currentMinute}분</span>
      </p>
    </div>
  )
}

Card.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  contents: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      index: PropTypes.number,
      value: PropTypes.string,
      height: PropTypes.number,
    }),
  ),
  parsedDate:PropTypes.number,
};
