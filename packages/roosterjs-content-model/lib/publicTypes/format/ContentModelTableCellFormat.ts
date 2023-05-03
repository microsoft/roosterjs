import { BorderBoxFormat } from './formatParts/BorderBoxFormat';
import { ContentModelBlockFormat } from './ContentModelBlockFormat';
import { TextColorFormat } from './formatParts/TextColorFormat';
import { VerticalAlignFormat } from './formatParts/VerticalAlignFormat';
import { WordBreakFormat } from '../format/formatParts/WordBreakFormat';

/**
 * Format of table cell
 */
export type ContentModelTableCellFormat = ContentModelBlockFormat &
    BorderBoxFormat &
    VerticalAlignFormat &
    WordBreakFormat &
    TextColorFormat;
