import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { BorderFormat } from './formatParts/BorderFormat';
import { TableCellMetadataFormat } from 'roosterjs-editor-types';
import { TextAlignFormat } from './formatParts/TextAlignFormat';
import { VerticalAlignFormat } from './formatParts/VerticalAlignFormat';

/**
 * Format of table cell
 */
export type ContentModelTableCellFormat = BorderFormat &
    BackgroundColorFormat &
    TextAlignFormat &
    VerticalAlignFormat &
    TableCellMetadataFormat;
