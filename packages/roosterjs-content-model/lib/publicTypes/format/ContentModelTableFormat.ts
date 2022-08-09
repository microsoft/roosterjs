import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { IdFormat } from './formatParts/IdFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { SizeFormat } from './formatParts/SizeFormat';
import { SpacingFormat } from './formatParts/SpacingFormat';
import { TableMetadataFormat } from './formatParts/TableMetadataFormat';

/**
 * Format of Table
 */
export type ContentModelTableFormat = IdFormat &
    SizeFormat &
    SpacingFormat &
    BackgroundColorFormat &
    MarginFormat &
    TableMetadataFormat;
