import { ContentModelAlignmentFormat } from './formatParts/ContentModelAlignmentFormat';
import { ContentModelBackgroundColorFormat } from './formatParts/ContentModelBackgroundColorFormat';
import { ContentModelBorderFormat } from './formatParts/ContentModelBorderFormat';
import { ContentModelSizeFormat } from './formatParts/ContentModelSizeFormat';

/**
 * Format of table cell
 */
export interface ContentModelTableCellFormat
    extends ContentModelSizeFormat,
        ContentModelBorderFormat,
        ContentModelBackgroundColorFormat,
        ContentModelAlignmentFormat {}
