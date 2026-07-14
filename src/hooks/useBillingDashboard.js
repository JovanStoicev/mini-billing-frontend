import React from "react";
import { getProducts, getReadings, getUser, previewInvoice } from "../api";
import { CONSUMER_REFERENCE, DEFAULT_BILLING_MONTH, DEFAULT_READING_FORM, INPUT_DIRECTORY } from "../config/billingConfig";
import { getMonthLabel, isInMonth, sortByDate, toBillingPeriod, toOffsetDateTime } from "../utils/date";
import { downloadJson } from "../utils/downloadUtils";
import { hasProduct, normalizeProducts } from "../utils/productUtils";
import {
  findDuplicateReading,
  findLatestReading,
  findLatestReadingBefore,
  getReadingValidationMessage,
  isReadingFormValid,
} from "../utils/readingUtils";

export function useBillingDashboard() {
  const [consumer, setConsumer] = React.useState(null);
  const [readings, setReadings] = React.useState([]);
  const [availableProducts, setAvailableProducts] = React.useState([]);
  const [productsLoaded, setProductsLoaded] = React.useState(false);
  const [newReadings, setNewReadings] = React.useState([]);
  const [billingMonth, setBillingMonth] = React.useState(DEFAULT_BILLING_MONTH);
  const [form, setForm] = React.useState(DEFAULT_READING_FORM);
  const [invoice, setInvoice] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [previewLoading, setPreviewLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const period = toBillingPeriod(billingMonth);
  const monthLabel = getMonthLabel(billingMonth);
  const draftReadingDate = toOffsetDateTime(form.readingDate, form.readingTime);
  const allReadings = React.useMemo(() => [...readings, ...newReadings], [readings, newReadings]);
  const selectedProductHasPrice = productsLoaded && hasProduct(availableProducts, form.product);

  const visibleReadings = React.useMemo(
    () => sortByDate(readings.filter((reading) => isInMonth(reading.date, billingMonth))),
    [readings, billingMonth]
  );

  const latestReadingBeforeDraft = React.useMemo(
    () => findLatestReadingBefore(allReadings, form.product, draftReadingDate),
    [allReadings, form.product, draftReadingDate]
  );

  const latestReadingForProduct = React.useMemo(
    () => findLatestReading(allReadings, form.product),
    [allReadings, form.product]
  );

  const duplicateReading = React.useMemo(
    () => findDuplicateReading(allReadings, form.product, draftReadingDate),
    [allReadings, form.product, draftReadingDate]
  );

  const sortedNewReadings = React.useMemo(
    () =>
      sortByDate(
        newReadings
          .map((reading, index) => ({ ...reading, originalIndex: index }))
          .filter((reading) => isInMonth(reading.date, billingMonth))
      ),
    [newReadings, billingMonth]
  );

  const canAddReading = isReadingFormValid(
    form,
    latestReadingBeforeDraft,
    duplicateReading,
    productsLoaded,
    selectedProductHasPrice
  );
  const readingValidationMessage = getReadingValidationMessage(
    form,
    latestReadingBeforeDraft,
    duplicateReading,
    productsLoaded,
    selectedProductHasPrice
  );

  async function loadConsumerData() {
    setLoading(true);
    setError("");
    setProductsLoaded(false);
    try {
      const [userResult, readingsResult, productsResult] = await Promise.all([
        getUser(CONSUMER_REFERENCE, INPUT_DIRECTORY),
        getReadings(CONSUMER_REFERENCE, INPUT_DIRECTORY),
        getProducts(CONSUMER_REFERENCE, INPUT_DIRECTORY),
      ]);
      const normalizedProducts = normalizeProducts(productsResult);

      setConsumer(userResult);
      setReadings(readingsResult);
      setAvailableProducts(normalizedProducts);
      setProductsLoaded(true);
      setForm((current) => {
        if (hasProduct(normalizedProducts, current.product)) {
          return current;
        }

        return { ...current, product: normalizedProducts[0] || current.product };
      });
    } catch (exception) {
      setError(exception.message);
      setConsumer(null);
      setReadings([]);
      setAvailableProducts([]);
      setProductsLoaded(false);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    loadConsumerData();
  }, []);

  React.useEffect(() => {
    const controller = new AbortController();

    async function updatePreview() {
      setPreviewLoading(true);
      setError("");
      try {
        const result = await previewInvoice(CONSUMER_REFERENCE, {
          period,
          inputDirectory: INPUT_DIRECTORY,
          newReadings,
        });
        if (!controller.signal.aborted) {
          setInvoice(result);
        }
      } catch (exception) {
        if (!controller.signal.aborted) {
          setError(exception.message);
          setInvoice(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setPreviewLoading(false);
        }
      }
    }

    updatePreview();
    return () => controller.abort();
  }, [period, newReadings]);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function addReading(event) {
    event.preventDefault();

    if (!canAddReading) {
      setError(readingValidationMessage);
      return;
    }

    setNewReadings((current) => [
      ...current,
      {
        product: form.product,
        date: draftReadingDate,
        value: Number(form.value),
      },
    ]);
    setForm((current) => ({ ...DEFAULT_READING_FORM, product: current.product, readingDate: current.readingDate }));
  }

  function removeReading(indexToRemove) {
    setNewReadings((current) => current.filter((_, index) => index !== indexToRemove));
  }

  function downloadTemporaryReadings() {
    downloadJson(
      "readings.json",
      newReadings.map((reading) => ({
        referenceNumber: CONSUMER_REFERENCE,
        product: reading.product,
        date: reading.date,
        value: reading.value,
      }))
    );
  }

  return {
    availableProducts,
    billingMonth,
    canAddReading,
    consumer,
    error,
    form,
    invoice,
    latestReadingForProduct,
    loading,
    monthLabel,
    newReadings,
    period,
    previewLoading,
    productsLoaded,
    readingValidationMessage,
    sortedNewReadings,
    visibleReadings,
    addReading,
    downloadTemporaryReadings,
    loadConsumerData,
    removeReading,
    setBillingMonth,
    updateForm,
  };
}
