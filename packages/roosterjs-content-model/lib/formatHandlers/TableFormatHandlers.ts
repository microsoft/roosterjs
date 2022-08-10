import { backgroundColorFormatHandler } from './common/backgroundColorFormatHandler';
import { ContentModelTableFormat } from '../publicTypes/format/ContentModelTableFormat';
import { FormatHandler } from './FormatHandler';
import { idFormatHandler } from './common/idFormatHandler';
import { marginFormatHandler } from './paragraph/marginFormatHandler';
import { sizeFormatHandler } from './common/sizeFormatHandler';
import { tableMetadataFormatHandler } from './table/tableMetadataFormatHandler';
import { tableSpacingFormatHandler } from './table/tableSpacingFormatHandler';

/**
 * @internal
 */
export const TableFormatHandlers: FormatHandler<ContentModelTableFormat>[] = [
    idFormatHandler,
    sizeFormatHandler,
    tableMetadataFormatHandler,
    tableSpacingFormatHandler,
    marginFormatHandler,
    backgroundColorFormatHandler,
];
