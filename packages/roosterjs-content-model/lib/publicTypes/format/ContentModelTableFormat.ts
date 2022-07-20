import { ContentModelBackgroundColorFormat } from './formatParts/ContentModelBackgroundColorFormat';
import { ContentModelIdFormat } from './formatParts/ContentModelIdFormat';
import { ContentModelMetadataFormat } from './formatParts/ContentModelMetadataFormat';
import { ContentModelSpacingFormat } from './formatParts/ContentModelSpacingFormat';
import { TableFormat } from 'roosterjs-editor-types';

/**
 * Format of Table
 */
export interface ContentModelTableFormat
    extends ContentModelIdFormat,
        ContentModelSpacingFormat,
        ContentModelBackgroundColorFormat,
        ContentModelMetadataFormat<TableFormat> {}
