import type { ReadonlyMark } from '../common/ReadonlyMark';
import type { MutableMark } from '../common/MutableMark';
import type { BorderBoxFormat } from './formatParts/BorderBoxFormat';
import type { ContentModelBlockFormatCommon } from './ContentModelBlockFormat';
import type { SizeFormat } from './formatParts/SizeFormat';
import type { TextColorFormat } from './formatParts/TextColorFormat';
import type { VerticalAlignFormat } from './formatParts/VerticalAlignFormat';
import type { WordBreakFormat } from '../format/formatParts/WordBreakFormat';

/**
 * Common part of format of table cell
 */
export type ContentModelTableCellFormatCommon = BorderBoxFormat &
    VerticalAlignFormat &
    WordBreakFormat &
    TextColorFormat &
    SizeFormat &
    ContentModelBlockFormatCommon;

/**
 * Format of table cell
 */
export type ContentModelTableCellFormat = MutableMark & ContentModelTableCellFormatCommon;

/**
 * Format of table cell (Readonly)
 */
export type ReadonlyContentModelTableCellFormat = ReadonlyMark &
    Readonly<ContentModelTableCellFormatCommon>;
