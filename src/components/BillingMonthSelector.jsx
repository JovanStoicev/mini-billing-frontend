import { Paper, Stack, TextField, Typography } from "@mui/material";

export function BillingMonthSelector({ month, period, onChange }) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Typography variant="h6" fontWeight={800}>
          Месец за преглед
        </Typography>
        <TextField
          label="Месец"
          type="month"
          value={month}
          onChange={(event) => onChange(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />
        <Typography variant="body2" color="text.secondary">
          Backend период: {period}
        </Typography>
      </Stack>
    </Paper>
  );
}
