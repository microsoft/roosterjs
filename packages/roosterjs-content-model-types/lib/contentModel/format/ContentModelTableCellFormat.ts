import type { BorderBoxFormat } from './formatParts/BorderBoxFormat';
import type { ContentModelBlockFormat } from './ContentModelBlockFormat';
import type { SizeFormat } from './formatParts/SizeFormat';
import type { TextColorFormat } from './formatParts/TextColorFormat';
import type { VerticalAlignFormat } from './formatParts/VerticalAlignFormat';
import type { WordBreakFormat } from '../format/formatParts/WordBreakFormat';

/**
 * Format of table cell
 */
export type ContentModelTableCellFormat = ContentModelBlockFormat &
    BorderBoxFormat &
    VerticalAlignFormat &
    WordBreakFormat &
    TextColorFormat &
    SizeFormat;
