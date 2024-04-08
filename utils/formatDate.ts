export function formatDate(date: Date) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const newDate = new Date(date);
  const month = monthNames[newDate.getMonth()];

  const day = newDate.getDate();
  const year = newDate.getFullYear();
  let dayWithSuffix;
  switch (day) {
    case 1:
    case 21:
    case 31:
      dayWithSuffix = day + "st";
      break;
    case 2:
    case 22:
      dayWithSuffix = day + "nd";
      break;
    case 3:
    case 23:
      dayWithSuffix = day + "rd";
      break;
    default:
      dayWithSuffix = day + "th";
  }

  return `${month} ${dayWithSuffix} ${year}`;
}
