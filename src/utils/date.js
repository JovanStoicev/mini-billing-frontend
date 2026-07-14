import { SOFIA_OFFSET } from "../config/billingConfig";

export function toBillingPeriod(month) {
  if (!month) {
    return "";
  }

  const [year, monthValue] = month.split("-");
  return `${year.slice(-2)}-${monthValue}`;
}

export function sortByDate(readings) {
  return [...readings].sort((first, second) => new Date(first.date).getTime() - new Date(second.date).getTime());
}

export function isInMonth(value, month) {
  if (!value || !month) {
    return false;
  }

  return value.slice(0, 7) === month;
}

export function getMonthLabel(month) {
  if (!month) {
    return "-";
  }

  const [year, monthValue] = month.split("-");
  return `${monthValue}.${year}`;
}

export function toOffsetDateTime(date, time) {
  return `${date}T${time}:00${SOFIA_OFFSET}`;
}

export function formatDate(value) {
  if (!value) {
    return "-";
  }

  return value.replace("T", " ").replace("Z", " UTC");
}
