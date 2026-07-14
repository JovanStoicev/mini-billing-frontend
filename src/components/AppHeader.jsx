import { Box, Button, Stack, Typography } from "@mui/material";
import { RefreshCw } from "lucide-react";

export function AppHeader({ loading, onReload }) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "stretch", md: "flex-start" }}
      gap={2}
      sx={{ width: "100%" }}
    >
      <Box>
        <Typography variant="overline" color="text.secondary" fontWeight={800}>
          MiniBilling
        </Typography>
        <Typography variant="h4" component="h1" fontWeight={800}>
          Live preview на месечна сметка
        </Typography>
      </Box>
      <Button
        variant="outlined"
        startIcon={<RefreshCw size={16} />}
        onClick={onReload}
        disabled={loading}
        sx={{ alignSelf: { xs: "stretch", md: "flex-start" }, ml: { md: "auto" } }}
      >
        {loading ? "Зареждане" : "Презареди CSV"}
      </Button>
    </Stack>
  );
}
