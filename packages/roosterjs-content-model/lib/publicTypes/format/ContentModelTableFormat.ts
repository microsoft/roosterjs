import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { IdFormat } from './formatParts/IdFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { MetadataFormat } from './formatParts/MetadataFormat';
import { SizeFormat } from './formatParts/SizeFormat';
import { SpacingFormat } from './formatParts/SpacingFormat';
import { TableFormat } from 'roosterjs-editor-types';

/**
 * Format of Table
 */
export interface ContentModelTableFormat
    extends IdFormat,
        SizeFormat,
        SpacingFormat,
        BackgroundColorFormat,
        MarginFormat,
        MetadataFormat<TableFormat> {}
