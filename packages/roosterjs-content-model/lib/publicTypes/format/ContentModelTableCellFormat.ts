import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { BorderFormat } from './formatParts/BorderFormat';
import { MetadataFormat } from './formatParts/MetadataFormat';
import { SizeFormat } from './formatParts/SizeFormat';
import { TextAlignFormat } from './formatParts/TextAlignFormat';
import { VerticalAlignFormat } from './formatParts/VerticalAlignFormat';

export interface TableCellFormat {
    /**
     * Set to true when if the cell has customized background color and
     * it will override the settings from table metadata
     */
    bgColorOverride?: boolean;
}

/**
 * Format of table cell
 */
export interface ContentModelTableCellFormat
    extends SizeFormat,
        BorderFormat,
        BackgroundColorFormat,
        TextAlignFormat,
        VerticalAlignFormat,
        MetadataFormat<TableCellFormat> {}
