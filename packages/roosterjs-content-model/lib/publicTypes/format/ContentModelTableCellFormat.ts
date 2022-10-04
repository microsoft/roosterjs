import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { BorderBoxFormat } from './formatParts/BorderBoxFormat';
import { BorderFormat } from './formatParts/BorderFormat';
import { PaddingFormat } from './formatParts/PaddingFormat';
import { TableCellMetadataFormat } from 'roosterjs-editor-types';
import { TextAlignFormat } from './formatParts/TextAlignFormat';
import { VerticalAlignFormat } from './formatParts/VerticalAlignFormat';

/**
 * Format of table cell
 */
export type ContentModelTableCellFormat = BorderFormat &
    BorderBoxFormat &
    BackgroundColorFormat &
    PaddingFormat &
    TextAlignFormat &
    VerticalAlignFormat &
    TableCellMetadataFormat;
