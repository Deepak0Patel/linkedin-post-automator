const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

/**
 * Returns lowercase day name for today (e.g., "monday")
 */
function getDayName(date = new Date()) {
  return DAYS[date.getDay()];
}

/**
 * Returns formatted date string (e.g., "Monday, 23 May 2026")
 */
function formatDate(date = new Date()) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

module.exports = { getDayName, formatDate, DAYS };
