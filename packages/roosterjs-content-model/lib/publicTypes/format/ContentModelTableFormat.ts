import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { IdFormat } from './formatParts/IdFormat';
import { MetadataFormat } from './formatParts/MetadataFormat';
import { SpacingFormat } from './formatParts/SpacingFormat';
import { TableFormat } from 'roosterjs-editor-types';

/**
 * Format of Table
 */
export interface ContentModelTableFormat
    extends IdFormat,
        SpacingFormat,
        BackgroundColorFormat,
        MetadataFormat<TableFormat> {}
