import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { BoldFormat } from './formatParts/BoldFormat';
import { BorderBoxFormat } from './formatParts/BorderBoxFormat';
import { BorderFormat } from './formatParts/BorderFormat';
import { DirectionFormat } from './formatParts/DirectionFormat';
import { FontFamilyFormat } from './formatParts/FontFamilyFormat';
import { FontSizeFormat } from './formatParts/FontSizeFormat';
import { IdFormat } from './formatParts/IdFormat';
import { ImageMetadataFormat } from './formatParts/ImageMetadataFormat';
import { ItalicFormat } from './formatParts/ItalicFormat';
import { ListMetadataFormat } from './formatParts/ListMetadataFormat';
import { ListThreadFormat } from './formatParts/ListThreadFormat';
import { ListTypeFormat } from './formatParts/ListTypeFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { PaddingFormat } from './formatParts/PaddingFormat';
import { SizeFormat } from './formatParts/SizeFormat';
import { SpacingFormat } from './formatParts/SpacingFormat';
import { StrikeFormat } from './formatParts/StrikeFormat';
import { SuperOrSubScriptFormat } from './formatParts/SuperOrSubScriptFormat';
import { TableCellMetadataFormat } from 'roosterjs-editor-types';
import { TableMetadataFormat } from './formatParts/TableMetadataFormat';
import { TextColorFormat } from './formatParts/TextColorFormat';
import { UnderlineAndLinkFormat } from './formatParts/UnderlineAndLinkFormat';
import { VerticalAlignFormat } from './formatParts/VerticalAlignFormat';

/**
 * Represents a record of all format handlers
 */
export interface FormatHandlerTypeMap {
    /**
     * Format for BackgroundColorFormat
     */
    backgroundColor: BackgroundColorFormat;

    /**
     * Format for BoldFormat
     */
    bold: BoldFormat;

    /**
     * Format for BorderFormat
     */
    border: BorderFormat;

    /**
     * Format for BorderBoxFormat
     */
    borderBox: BorderBoxFormat;

    /**
     * Format for DirectionFormat
     */
    direction: DirectionFormat;

    /**
     * Format for FontFamilyFormat
     */
    fontFamily: FontFamilyFormat;

    /**
     * Format for FontSizeFormat
     */
    fontSize: FontSizeFormat;

    /**
     * Format for IdFormat
     */
    id: IdFormat;

    /**
     * Format for ImageMetadataFormat
     */
    imageMetadata: ImageMetadataFormat;

    /**
     * Format for ItalicFormat
     */
    italic: ItalicFormat;

    /**
     * Format for ListMetadataFormat (used by list item)
     */
    listItemMetadata: ListMetadataFormat;

    /**
     * Format for ListThreadFormat (used by list item)
     */
    listItemThread: ListThreadFormat;

    /**
     * Format for ListMetadataFormat (used by list level)
     */
    listLevelMetadata: ListMetadataFormat;

    /**
     * Format for ListThreadFormat (used by list level)
     */
    listLevelThread: ListThreadFormat;

    /**
     * Format for ListTypeFormat
     */
    listType: ListTypeFormat;

    /**
     * Format for MarginFormat
     */
    margin: MarginFormat;

    /**
     * Format for PaddingFormat
     */
    padding: PaddingFormat;

    /**
     * Format for SizeFormat
     */
    size: SizeFormat;

    /**
     * Format for StrikeFormat
     */
    strike: StrikeFormat;

    /**
     * Format for SuperOrSubScriptFormat
     */
    superOrSubScript: SuperOrSubScriptFormat;

    /**
     * Format for TableCellMetadataFormat
     */
    tableCellMetadata: TableCellMetadataFormat;

    /**
     * Format for TableMetadataFormat
     */
    tableMetadata: TableMetadataFormat;

    /**
     * Format for SpacingFormat
     */
    tableSpacing: SpacingFormat;

    /**
     * Format for TextColorFormat
     */
    textColor: TextColorFormat;

    /**
     * Format for UnderlineFormat
     */
    underline: UnderlineAndLinkFormat;

    /**
     * Format for VerticalAlignFormat
     */
    verticalAlign: VerticalAlignFormat;
}

/**
 * Key of all format handler
 */
export type FormatKey = keyof FormatHandlerTypeMap;
