const getDate = (parsedDate) => {
  if (parsedDate === null || parsedDate === undefined) {
    return null;
  } 

  const todayDate = new Date(parsedDate);

  const currentYear = todayDate.getFullYear();
  const currentMonth = todayDate.getMonth() + 1;
  const currentDate = todayDate.getDate();
  const currentDay = todayDate.getDay();
  const currentHour = todayDate.getHours() > 12 ? "오후 " + (todayDate.getHours() - 12) : "오전 " + todayDate.getHours();
  const currentMinute = todayDate.getMinutes();

  return { currentYear, currentMonth, currentDate, currentDay, currentHour, currentMinute };
}

export default getDate;
