import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { formatDate } from "../utils/date";
import { EmptyState } from "./EmptyState";
import { SectionHeader } from "./SectionHeader";

export function ReadingsTable({ readings, monthLabel }) {
  return (
    <Paper className="panel" elevation={0}>
      <SectionHeader title={`CSV отчети за ${monthLabel}`} label={readings.length} />
      {readings.length === 0 ? (
        <EmptyState text="Няма заредени отчети за избрания месец." />
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Продукт</TableCell>
                <TableCell>Дата и час</TableCell>
                <TableCell align="right">Показание</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {readings.map((reading, index) => (
                <TableRow key={`${reading.referenceNumber}-${reading.date}-${index}`}>
                  <TableCell>{reading.product}</TableCell>
                  <TableCell>{formatDate(reading.date)}</TableCell>
                  <TableCell align="right">{reading.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
