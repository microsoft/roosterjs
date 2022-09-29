import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { BoldFormat } from './formatParts/BoldFormat';
import { BorderFormat } from './formatParts/BorderFormat';
import { FontFamilyFormat } from './formatParts/FontFamilyFormat';
import { FontSizeFormat } from './formatParts/FontSizeFormat';
import { IdFormat } from './formatParts/IdFormat';
import { ItalicFormat } from './formatParts/ItalicFormat';
import { ListMetadataFormat } from './formatParts/ListMetadataFormat';
import { ListThreadFormat } from './formatParts/ListThreadFormat';
import { ListTypeFormat } from './formatParts/ListTypeFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { SpacingFormat } from './formatParts/SpacingFormat';
import { StrikeFormat } from './formatParts/StrikeFormat';
import { SuperOrSubScriptFormat } from './formatParts/SuperOrSubScriptFormat';
import { TableCellMetadataFormat } from 'roosterjs-editor-types';
import { TableMetadataFormat } from './formatParts/TableMetadataFormat';
import { TextAlignFormat } from './formatParts/TextAlignFormat';
import { TextColorFormat } from './formatParts/TextColorFormat';
import { UnderlineFormat } from './formatParts/UnderlineFormat';
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
     * Format for TextAlignFormat
     */
    textAlign: TextAlignFormat;

    /**
     * Format for TextColorFormat
     */
    textColor: TextColorFormat;

    /**
     * Format for UnderlineFormat
     */
    underline: UnderlineFormat;

    /**
     * Format for VerticalAlignFormat
     */
    verticalAlign: VerticalAlignFormat;
}

/**
 * Key of all format handler
 */
export type FormatKey = keyof FormatHandlerTypeMap;
