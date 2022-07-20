import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { BorderFormat } from './formatParts/BorderFormat';
import { HorizontalAlignFormat } from './formatParts/HorizontalAlignFormat';
import { SizeFormat } from './formatParts/SizeFormat';
import { VerticalAlignFormat } from './formatParts/VerticalAlignFormat';

/**
 * Format of table cell
 */
export interface ContentModelTableCellFormat
    extends SizeFormat,
        BorderFormat,
        BackgroundColorFormat,
        HorizontalAlignFormat,
        VerticalAlignFormat {}
