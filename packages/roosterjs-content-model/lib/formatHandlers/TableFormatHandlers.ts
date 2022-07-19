import { ContentModelTableFormat } from '../publicTypes';
import { FormatHandler } from './FormatHandler';
import { tableIdHandler } from './table/tableIdHandler';
import { tableMetadataHandler } from './table/tableMetadataHandler';
import { tableSpacingHandler } from './table/tableSpacingHandler';

/**
 * @internal
 */
export const TableFormatHandlers: FormatHandler<ContentModelTableFormat>[] = [
    tableIdHandler,
    tableMetadataHandler,
    tableSpacingHandler,
];
