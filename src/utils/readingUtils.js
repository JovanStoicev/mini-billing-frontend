import { sortByDate } from "./date";

export function findLatestReading(readings, product) {
  return sortByDate(readings.filter((reading) => reading.product === product)).at(-1) || null;
}

export function findLatestReadingBefore(readings, product, date) {
  const targetDate = new Date(date).getTime();

  if (!Number.isFinite(targetDate)) {
    return null;
  }

  return (
    sortByDate(
      readings.filter((reading) => reading.product === product && new Date(reading.date).getTime() < targetDate)
    ).at(-1) || null
  );
}

export function findDuplicateReading(readings, product, date) {
  return readings.find((reading) => reading.product === product && reading.date === date) || null;
}

export function isReadingFormValid(form, latestReadingBeforeDraft, duplicateReading, productsLoaded, selectedProductHasPrice) {
  if (!form.value || !form.readingDate || !form.readingTime || !form.product) {
    return false;
  }

  if (!productsLoaded || !selectedProductHasPrice || duplicateReading) {
    return false;
  }

  if (!latestReadingBeforeDraft) {
    return true;
  }

  return Number(form.value) > Number(latestReadingBeforeDraft.value);
}

export function getReadingValidationMessage(
  form,
  latestReadingBeforeDraft,
  duplicateReading,
  productsLoaded,
  selectedProductHasPrice
) {
  if (!productsLoaded) {
    return "Зареждам цените от backend-а.";
  }

  if (!form.value || !form.readingDate || !form.readingTime || !form.product) {
    return "Попълни продукт, дата, час и ново показание.";
  }

  if (!selectedProductHasPrice) {
    return `Няма цена за ${form.product} в ценовата листа на клиента.`;
  }

  if (duplicateReading) {
    return `Вече има отчет за ${form.product} на избраните дата и час. Смени датата или часа.`;
  }

  if (!latestReadingBeforeDraft) {
    return `Това ще бъде първият отчет за ${form.product}. За изчисление ще трябва и следващ отчет.`;
  }

  if (Number(form.value) <= Number(latestReadingBeforeDraft.value)) {
    return `Новото показание трябва да е по-голямо от последния отчет преди избраната дата за ${form.product}: ${latestReadingBeforeDraft.value}.`;
  }

  return `Последен отчет преди избраната дата за ${form.product}: ${latestReadingBeforeDraft.value}.`;
}
