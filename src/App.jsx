import { Alert, Box, Container, Stack } from "@mui/material";
import { AppHeader } from "./components/AppHeader";
import { CustomerPanel } from "./components/CustomerPanel";
import { InvoiceLinesTable } from "./components/InvoiceLinesTable";
import { MetricsGrid } from "./components/MetricsGrid";
import { ReadingsTable } from "./components/ReadingsTable";
import { TemporaryReadingsTable } from "./components/TemporaryReadingsTable";
import { SUPPORTED_PRODUCTS } from "./config/billingConfig";
import { useBillingDashboard } from "./hooks/useBillingDashboard";

export function App() {
  const {
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
  } = useBillingDashboard();

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
