import { Box } from "@mui/material";
import { formatMoney } from "../utils/format";
import { MetricCard } from "./MetricCard";

export function MetricsGrid({ monthLabel, period, totalAmount, previewLoading }) {
  return (
    <Box className="metrics-grid">
      <MetricCard label="Месец" value={monthLabel} />
      <MetricCard label={`Обща сума (${period})`} value={formatMoney(totalAmount)} />
      <MetricCard label="Статус" value={previewLoading ? "Обновяване" : "Готово"} />
    </Box>
  );
}
