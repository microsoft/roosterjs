import { alignmentFormatHandler } from './common/alignmentFormatHandler';
import { backgroundColorFormatHandler } from './common/backgroundColorFormatHandler';
import { borderFormatHandler } from './common/borderFormatHandler';
import { ContentModelTableCellFormat } from '../publicTypes/format/ContentModelTableCellFormat';
import { FormatHandler } from './FormatHandler';
import { sizeFormatHandler } from './common/sizeFormatHandler';

/**
 * @internal
 */
export const TableCellFormatHandlers: FormatHandler<ContentModelTableCellFormat>[] = [
    sizeFormatHandler,
    borderFormatHandler,
    backgroundColorFormatHandler,
    alignmentFormatHandler,
];
