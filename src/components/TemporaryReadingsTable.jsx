import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Download, Trash2 } from "lucide-react";
import { formatDate } from "../utils/date";
import { EmptyState } from "./EmptyState";
import { SectionHeader } from "./SectionHeader";

export function TemporaryReadingsTable({ readings, canDownload, onDownload, onRemove }) {
  return (
    <Paper className="panel" elevation={0}>
      <SectionHeader
        title="Временни отчети"
        label={readings.length}
        action={
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download size={16} />}
            disabled={!canDownload}
            onClick={onDownload}
          >
            Свали JSON
          </Button>
        }
      />
      {readings.length === 0 ? (
        <EmptyState text="Добави отчет от формата вляво. Таблицата се обновява автоматично." />
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Продукт</TableCell>
                <TableCell>Дата и час</TableCell>
                <TableCell align="right">Показание</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {readings.map((reading) => (
                <TableRow key={reading.originalIndex}>
                  <TableCell>{reading.product}</TableCell>
                  <TableCell>{formatDate(reading.date)}</TableCell>
                  <TableCell align="right">{reading.value}</TableCell>
                  <TableCell align="right">
                    <IconButton color="error" onClick={() => onRemove(reading.originalIndex)} aria-label="Премахни отчет">
                      <Trash2 size={17} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
