import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { BorderBoxFormat } from './formatParts/BorderBoxFormat';
import { BorderFormat } from './formatParts/BorderFormat';
import { DirectionFormat } from './formatParts/DirectionFormat';
import { PaddingFormat } from './formatParts/PaddingFormat';
import { VerticalAlignFormat } from './formatParts/VerticalAlignFormat';

/**
 * Format of table cell
 */
export type ContentModelTableCellFormat = BorderFormat &
    BorderBoxFormat &
    BackgroundColorFormat &
    PaddingFormat &
    DirectionFormat &
    VerticalAlignFormat;
