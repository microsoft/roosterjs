import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { IdFormat } from './formatParts/IdFormat';
import { SizeFormat } from './formatParts/SizeFormat';
import { SpacingFormat } from './formatParts/SpacingFormat';
import { TableMetadataFormat } from './formatParts/TableMetadataFormat';

/**
 * Format of Table
 */
export interface ContentModelTableFormat
    extends IdFormat,
        SizeFormat,
        SpacingFormat,
        BackgroundColorFormat,
        TableMetadataFormat {}
