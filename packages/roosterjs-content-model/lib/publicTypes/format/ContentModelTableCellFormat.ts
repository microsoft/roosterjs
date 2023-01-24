import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { BorderBoxFormat } from './formatParts/BorderBoxFormat';
import { BorderFormat } from './formatParts/BorderFormat';
import { DirectionFormat } from './formatParts/DirectionFormat';
import { PaddingFormat } from './formatParts/PaddingFormat';
import { TextColorFormat } from './formatParts/TextColorFormat';
import { VerticalAlignFormat } from './formatParts/VerticalAlignFormat';
import { WordBreakFormat } from '../format/formatParts/WordBreakFormat';

/**
 * Format of table cell
 */
export type ContentModelTableCellFormat = BorderFormat &
    BorderBoxFormat &
    BackgroundColorFormat &
    PaddingFormat &
    DirectionFormat &
    VerticalAlignFormat &
    WordBreakFormat &
    TextColorFormat;
