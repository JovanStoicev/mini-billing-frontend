import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { CONSUMER_REFERENCE, INPUT_DIRECTORY } from "../config/billingConfig";
import { BillingMonthSelector } from "./BillingMonthSelector";
import { ReadingForm } from "./ReadingForm";

export function CustomerPanel({
  consumer,
  form,
  billingMonth,
  period,
  products,
  availableProducts,
  productsLoaded,
  onBillingMonthChange,
  onFormChange,
  onAddReading,
  canAddReading,
  lastReading,
  readingValidationMessage,
}) {
  return (
    <Paper className="panel" elevation={0}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={800}>
            CSV директория
          </Typography>
          <Typography variant="body1" fontWeight={700}>
            {INPUT_DIRECTORY}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={800}>
            Клиент
          </Typography>
          <Typography variant="h6" fontWeight={800}>
            {consumer?.name || "Marko Boikov Tsvetkov"}
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
            <Chip label={`Абонат ${CONSUMER_REFERENCE}`} size="small" />
            <Chip label={`Ценова листа ${consumer?.priceListNumber || 1}`} size="small" color="primary" />
          </Stack>
        </Box>

        <BillingMonthSelector month={billingMonth} period={period} onChange={onBillingMonthChange} />
        <ReadingForm
          form={form}
          period={period}
          products={products}
          availableProducts={availableProducts}
          productsLoaded={productsLoaded}
          canAddReading={canAddReading}
          lastReading={lastReading}
          validationMessage={readingValidationMessage}
          onChange={onFormChange}
          onSubmit={onAddReading}
        />
      </Stack>
    </Paper>
  );
}