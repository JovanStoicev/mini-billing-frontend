import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { formatDate } from "../utils/date";
import { formatDecimal, formatMoney } from "../utils/format";
import { EmptyState } from "./EmptyState";
import { SectionHeader } from "./SectionHeader";

export function InvoiceLinesTable({ lines = [] }) {
  return (
    <Paper className="panel" elevation={0}>
      <SectionHeader title="Изчисления" label={`${lines.length} линии`} />
      {lines.length === 0 ? (
        <EmptyState text="Няма достатъчно отчети за избрания месец или продукт." />
      ) : (
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Продукт</TableCell>
                <TableCell>Период</TableCell>
                <TableCell align="right">Количество</TableCell>
                <TableCell align="right">Цена</TableCell>
                <TableCell align="right">Сума</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lines.map((line) => (
                <TableRow key={line.index}>
                  <TableCell>{line.index}</TableCell>
                  <TableCell>{line.product}</TableCell>
                  <TableCell>
                    {formatDate(line.lineStart)} - {formatDate(line.lineEnd)}
                  </TableCell>
                  <TableCell align="right">{formatDecimal(line.quantity)}</TableCell>
                  <TableCell align="right">{formatDecimal(line.price)}</TableCell>
                  <TableCell align="right">{formatMoney(line.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}
