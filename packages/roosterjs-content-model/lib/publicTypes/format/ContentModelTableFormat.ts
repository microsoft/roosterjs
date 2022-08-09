import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { IdFormat } from './formatParts/IdFormat';
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
        TableFormat {}
