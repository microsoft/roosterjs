import { ContentModelTableCellFormat } from '../publicTypes/format/ContentModelTableCellFormat';
import { FormatHandler } from './FormatHandler';
import { tableCellAlignmentHandler } from './tableCell/tableCellAlignmentHandler';
import { tableCellBorderHandler } from './tableCell/tableCellBorderHandler';
import { tableCellShadeHandler } from './tableCell/tableCellShadeHandler';
import { tableCellSizeHandler } from './tableCell/tableCellSizeHandler';

/**
 * @internal
 */
export const TableCellFormatHandlers: FormatHandler<ContentModelTableCellFormat>[] = [
    tableCellSizeHandler,
    tableCellBorderHandler,
    tableCellShadeHandler,
    tableCellAlignmentHandler,
];
