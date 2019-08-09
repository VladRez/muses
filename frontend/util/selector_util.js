export const timeDate = timestamp => {
  let date = new Date(timestamp);
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  let formattedDate = `${
    months[date.getMonth()]
  } ${date.getDay()}, ${date.getFullYear()}`;
  return formattedDate;
};
