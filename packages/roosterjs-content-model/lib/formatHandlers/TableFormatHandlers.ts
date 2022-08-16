import { backgroundColorFormatHandler } from './common/backgroundColorFormatHandler';
import { borderFormatHandler } from './common/borderFormatHandler';
import { ContentModelTableFormat } from '../publicTypes/format/ContentModelTableFormat';
import { FormatHandler } from './FormatHandler';
import { idFormatHandler } from './common/idFormatHandler';
import { marginFormatHandler } from './paragraph/marginFormatHandler';
import { tableMetadataFormatHandler } from './table/tableMetadataFormatHandler';
import { tableSpacingFormatHandler } from './table/tableSpacingFormatHandler';

/**
 * @internal
 */
export const TableFormatHandlers: FormatHandler<ContentModelTableFormat>[] = [
    idFormatHandler,
    borderFormatHandler,
    tableMetadataFormatHandler,
    tableSpacingFormatHandler,
    marginFormatHandler,
    backgroundColorFormatHandler,
];
