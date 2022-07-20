import { backgroundColorFormatHandler } from './common/backgroundColorFormatHandler';
import { borderFormatHandler } from './common/borderFormatHandler';
import { ContentModelTableCellFormat } from '../publicTypes/format/ContentModelTableCellFormat';
import { FormatHandler } from './FormatHandler';
import { horizontalAlignFormatHandler } from './common/horizontalAlignFormatHandler';
import { sizeFormatHandler } from './common/sizeFormatHandler';
import { verticalAlignFormatHandler } from './common/verticalAlignFormatHandler';

/**
 * @internal
 */
export const TableCellFormatHandlers: FormatHandler<ContentModelTableCellFormat>[] = [
    sizeFormatHandler,
    borderFormatHandler,
    backgroundColorFormatHandler,
    horizontalAlignFormatHandler,
    verticalAlignFormatHandler,
];
