export function formatMoney(value) {
  return formatDecimal(value);
}

export function formatDecimal(value) {
  if (value === undefined || value === null) {
    return "0.00";
  }

  return Number(value).toFixed(2);
}
