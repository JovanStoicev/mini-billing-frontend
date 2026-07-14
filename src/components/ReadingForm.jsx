import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Plus } from "lucide-react";
import { formatDate } from "../utils/date";

export function ReadingForm({
  form,
  period,
  products,
  availableProducts,
  productsLoaded,
  canAddReading,
  lastReading,
  validationMessage,
  onChange,
  onSubmit,
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack component="form" spacing={2} onSubmit={onSubmit}>
        <Box>
          <Typography variant="h6" fontWeight={800}>
            Нов отчет
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Добавеният отчет участва в изчисленията за избрания период: {period}
          </Typography>
        </Box>

        <FormControl fullWidth>
          <InputLabel id="product-label">Продукт</InputLabel>
          <Select
            labelId="product-label"
            label="Продукт"
            value={form.product}
            onChange={(event) => onChange("product", event.target.value)}
          >
            {products.map((product) => {
              const hasPrice = hasProduct(availableProducts, product);
              const isDisabled = productsLoaded && !hasPrice;
              return (
                <MenuItem key={product} value={product} disabled={isDisabled}>
                  {isDisabled ? `${product} (няма цена)` : product}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <TextField
          label="Дата на отчет"
          type="date"
          value={form.readingDate}
          onChange={(event) => onChange("readingDate", event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />

        <TextField
          label="Час на отчет"
          type="time"
          value={form.readingTime}
          onChange={(event) => onChange("readingTime", event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
        />

        <TextField
          label="Ново показание"
          type="number"
          value={form.value}
          onChange={(event) => onChange("value", event.target.value)}
          helperText={validationMessage}
          error={Boolean(form.value) && !canAddReading}
          inputProps={{ step: "0.001" }}
          fullWidth
        />

        {lastReading && (
          <Typography variant="body2" color="text.secondary">
            Последен въведен отчет за {form.product}: {lastReading.value} ({formatDate(lastReading.date)})
          </Typography>
        )}

        <Button type="submit" variant="contained" size="large" startIcon={<Plus size={16} />} disabled={!canAddReading}>
          Добави отчет
        </Button>
      </Stack>
    </Paper>
  );
}

function hasProduct(products, product) {
  return products.includes(String(product || "").trim().toLowerCase());
}
