import { Paper, Typography } from "@mui/material";

export function MetricCard({ label, value }) {
  return (
    <Paper className="metric-card" elevation={0}>
      <Typography variant="caption" color="text.secondary" fontWeight={800}>
        {label}
      </Typography>
      <Typography variant="h6" fontWeight={800}>
        {value}
      </Typography>
    </Paper>
  );
}