import { Typography } from "@mui/material";

export function EmptyState({ text }) {
  return (
    <Typography color="text.secondary" sx={{ py: 1 }}>
      {text}
    </Typography>
  );
}