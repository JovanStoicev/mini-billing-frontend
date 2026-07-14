import React from "react";
import { Alert, Box, Container, Stack } from "@mui/material";
import { getProducts, getReadings, getUser, previewInvoice } from "./api";
import { AppHeader } from "./components/AppHeader";
import { CustomerPanel } from "./components/CustomerPanel";
import { InvoiceLinesTable } from "./components/InvoiceLinesTable";
import { MetricsGrid } from "./components/MetricsGrid";
import { ReadingsTable } from "./components/ReadingsTable";
import { TemporaryReadingsTable } from "./components/TemporaryReadingsTable";
import { CONSUMER_REFERENCE, DEFAULT_BILLING_MONTH, DEFAULT_READING_FORM, INPUT_DIRECTORY } from "./config/billingConfig";
import { getMonthLabel, isInMonth, sortByDate, toBillingPeriod, toOffsetDateTime } from "./utils/date";

const SUPPORTED_PRODUCTS = ["gas", "elec"];

export function App() {
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

  const canAddReading = isReadingFormValid(form, latestReadingBeforeDraft, duplicateReading, productsLoaded, selectedProductHasPrice);
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
      setConsumer(userResult);
      setReadings(readingsResult);
      const normalizedProducts = normalizeProducts(productsResult);

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
    const fileContent = JSON.stringify(
      newReadings.map((reading) => ({
        referenceNumber: CONSUMER_REFERENCE,
        product: reading.product,
        date: reading.date,
        value: reading.value,
      })),
      null,
      2
    );
    const blob = new Blob([fileContent], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "readings.json";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <AppHeader loading={loading} onReload={loadConsumerData} />
        {error && <Alert severity="error">{error}</Alert>}

        <Box className="workspace-grid">
          <CustomerPanel
            consumer={consumer}
            form={form}
            billingMonth={billingMonth}
            period={period}
            products={SUPPORTED_PRODUCTS}
            availableProducts={availableProducts}
            productsLoaded={productsLoaded}
            onBillingMonthChange={setBillingMonth}
            onFormChange={updateForm}
            onAddReading={addReading}
            canAddReading={canAddReading}
            lastReading={latestReadingForProduct}
            readingValidationMessage={readingValidationMessage}
          />

          <Stack spacing={3} minWidth={0}>
            <MetricsGrid
              monthLabel={monthLabel}
              period={period}
              totalAmount={invoice?.totalAmount}
              previewLoading={previewLoading}
            />
            <TemporaryReadingsTable
              readings={sortedNewReadings}
              canDownload={newReadings.length > 0}
              onDownload={downloadTemporaryReadings}
              onRemove={removeReading}
            />
            <InvoiceLinesTable lines={invoice?.lines || []} />
            <ReadingsTable readings={visibleReadings} monthLabel={monthLabel} />
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}

function findLatestReading(readings, product) {
  return sortByDate(readings.filter((reading) => reading.product === product)).at(-1) || null;
}

function findLatestReadingBefore(readings, product, date) {
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

function findDuplicateReading(readings, product, date) {
  return readings.find((reading) => reading.product === product && reading.date === date) || null;
}

function normalizeProducts(products) {
  return products.map(normalizeProduct).filter(Boolean);
}

function normalizeProduct(product) {
  return String(product || "").trim().toLowerCase();
}

function hasProduct(products, product) {
  return products.includes(normalizeProduct(product));
}

function isReadingFormValid(form, latestReadingBeforeDraft, duplicateReading, productsLoaded, selectedProductHasPrice) {
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

function getReadingValidationMessage(form, latestReadingBeforeDraft, duplicateReading, productsLoaded, selectedProductHasPrice) {
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
