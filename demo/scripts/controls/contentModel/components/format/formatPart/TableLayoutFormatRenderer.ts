import { createTextFormatRenderer } from '../utils/createTextFormatRenderer';
import { FormatRenderer } from '../utils/FormatRenderer';
import { TableLayoutFormat } from 'roosterjs-content-model';

export const TableLayoutFormatRenderer: FormatRenderer<TableLayoutFormat> = createTextFormatRenderer<
    TableLayoutFormat
>(
    'TableLayout',
    format => format.tableLayout,
    (format, value) => (format.tableLayout = value)
);
