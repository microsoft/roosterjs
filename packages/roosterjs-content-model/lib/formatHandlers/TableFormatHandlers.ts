import { ContentModelTableFormat } from '../publicTypes';
import { FormatHandler } from './FormatHandler';
import { tableCellSpacingHandler } from './table/tableSpacingHandler';
import { tableIdHandler } from './table/tableIdHandler';
import { tableMetadataHandler } from './table/tableMetadataHandler';

/**
 * @internal
 */
export const TableFormatHandlers: FormatHandler<ContentModelTableFormat>[] = [
    tableIdHandler,
    tableMetadataHandler,
    tableCellSpacingHandler,
];
