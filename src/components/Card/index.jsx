import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import getDate from "../../utils/getDate";
import changeDayFormat from "../../utils/changeDayFormat";

export default function Card({ id, title, contents, createdAt, modifiedAt }) {
  const firstLine = contents[0].value;
  const { currentYear: createdYear, currentMonth: createdMonth, currentDate: createdDate, currentDay: createdDay, currentHour: createdHour, currentMinute: createdMinute } = getDate(createdAt);
  const modifiedDate = getDate(modifiedAt);

  return (
    <div className="flex flex-col items-start justify-center gap-5 w-full border-2 border-solid border-red-1 rounded-[15px] px-20 py-10">
      <p className="flex items-center gap-10">
        <span className="text-red-1 text-20">1️⃣ Link: </span>
        <Link to={`/docs/${id}`} target="_blank">
          <span className="text-white text-18 underline">https://share-your-docs.netlify.app/docs/{id}</span>
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
        <span className="text-red-1 text-20">4️⃣ Created date: </span>
        <span className="text-white text-18">{createdYear}년 {createdMonth}월 {createdDate}일 {changeDayFormat(createdDay)} {createdHour}시 {createdMinute}분</span>
      </p>
      <p className="flex items-center gap-10">
        <span className="text-red-1 text-20">5️⃣ Modified date: </span>
        <span className="text-white text-18">
          {modifiedDate ? 
            `${modifiedDate.currentYear}년 ${modifiedDate.currentMonth}월 ${modifiedDate.currentDate}일 ${changeDayFormat(modifiedDate.currentDay)} ${modifiedDate.currentHour}시 ${modifiedDate.currentMinute}분` :
            "수정 내역이 없습니다"
          }
        </span>
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
  createdAt:PropTypes.number,
  modifiedAt:PropTypes.number,
};
