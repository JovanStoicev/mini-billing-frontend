import { Box, Chip, Stack, Typography } from "@mui/material";

export function SectionHeader({ title, label, action }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2} sx={{ mb: 2 }}>
      <Typography variant="h6" fontWeight={800}>
        {title}
      </Typography>
      <Box display="flex" alignItems="center" gap={1}>
        {action}
        <Chip label={label} size="small" />
      </Box>
    </Stack>
  );
}
