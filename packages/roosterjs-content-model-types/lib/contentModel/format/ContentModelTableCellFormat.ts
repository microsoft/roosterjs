import type { BoldFormat } from './formatParts/BoldFormat';
import type { BorderBoxFormat } from './formatParts/BorderBoxFormat';
import type { ContentModelBlockFormat } from './ContentModelBlockFormat';
import type { DiagonalBorderFormat } from './formatParts/DiagonalBorderFormat';
import type { SizeFormat } from './formatParts/SizeFormat';
import type { TextColorFormat } from './formatParts/TextColorFormat';
import type { VerticalAlignFormat } from './formatParts/VerticalAlignFormat';
import type { WordBreakFormat } from '../format/formatParts/WordBreakFormat';

/**
 * Format of table cell
 */
export type ContentModelTableCellFormat = ContentModelBlockFormat &
    BorderBoxFormat &
    DiagonalBorderFormat &
    VerticalAlignFormat &
    WordBreakFormat &
    TextColorFormat &
    SizeFormat &
    BoldFormat;
