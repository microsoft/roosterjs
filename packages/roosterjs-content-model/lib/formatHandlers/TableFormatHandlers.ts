import { backgroundColorFormatHandler } from './common/backgroundColorFormatHandler';
import { ContentModelTableFormat } from '../publicTypes/format/ContentModelTableFormat';
import { FormatHandler } from './FormatHandler';
import { idFormatHandler } from './common/idFormatHandler';
import { tableMetadataFormatHandler } from './table/tableMetadataFormatHandler';
import { tableSpacingFormatHandler } from './table/tableSpacingFormatHandler';

/**
 * @internal
 */
export const TableFormatHandlers: FormatHandler<ContentModelTableFormat>[] = [
    idFormatHandler,
    tableMetadataFormatHandler,
    tableSpacingFormatHandler,
    backgroundColorFormatHandler,
];
