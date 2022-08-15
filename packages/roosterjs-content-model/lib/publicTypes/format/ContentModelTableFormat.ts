import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { BorderFormat } from './formatParts/BorderFormat';
import { IdFormat } from './formatParts/IdFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { SpacingFormat } from './formatParts/SpacingFormat';
import { TableMetadataFormat } from './formatParts/TableMetadataFormat';

/**
 * Format of Table
 */
export type ContentModelTableFormat = IdFormat &
    BorderFormat &
    SpacingFormat &
    BackgroundColorFormat &
    MarginFormat &
    TableMetadataFormat;
