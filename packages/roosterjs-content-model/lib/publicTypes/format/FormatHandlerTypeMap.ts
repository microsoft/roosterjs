import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { BoldFormat } from './formatParts/BoldFormat';
import { BorderBoxFormat } from './formatParts/BorderBoxFormat';
import { BorderFormat } from './formatParts/BorderFormat';
import { BoxShadowFormat } from './formatParts/BoxShadowFormat';
import { DatasetFormat } from './formatParts/DatasetFormat';
import { DirectionFormat } from './formatParts/DirectionFormat';
import { DisplayFormat } from './formatParts/DisplayFormat';
import { FontFamilyFormat } from './formatParts/FontFamilyFormat';
import { FontSizeFormat } from './formatParts/FontSizeFormat';
import { HtmlAlignFormat } from './formatParts/HtmlAlignFormat';
import { IdFormat } from './formatParts/IdFormat';
import { ItalicFormat } from './formatParts/ItalicFormat';
import { LetterSpacingFormat } from './formatParts/LetterSpacingFormat';
import { LineHeightFormat } from './formatParts/LineHeightFormat';
import { LinkFormat } from './formatParts/LinkFormat';
import { ListMetadataFormat } from './formatParts/ListMetadataFormat';
import { ListStylePositionFormat } from './formatParts/ListStylePositionFormat';
import { ListThreadFormat } from './formatParts/ListThreadFormat';
import { ListTypeFormat } from './formatParts/ListTypeFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { PaddingFormat } from './formatParts/PaddingFormat';
import { SizeFormat } from './formatParts/SizeFormat';
import { SpacingFormat } from './formatParts/SpacingFormat';
import { StrikeFormat } from './formatParts/StrikeFormat';
import { SuperOrSubScriptFormat } from './formatParts/SuperOrSubScriptFormat';
import { TableLayoutFormat } from './formatParts/TableLayoutFormat';
import { TextAlignFormat } from './formatParts/TextAlignFormat';
import { TextColorFormat } from './formatParts/TextColorFormat';
import { UnderlineFormat } from './formatParts/UnderlineFormat';
import { VerticalAlignFormat } from './formatParts/VerticalAlignFormat';
import { WhiteSpaceFormat } from './formatParts/WhiteSpaceFormat';
import { WordBreakFormat } from './formatParts/WordBreakFormat';

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
     * Format for BoxShadowFormat
     */
    boxShadow: BoxShadowFormat;

    /**
     * Format for DatasetFormat
     */
    dataset: DatasetFormat;

    /**
     * Format for DirectionFormat
     */
    direction: DirectionFormat;

    /**
     * Format for DisplayFormat
     */
    display: DisplayFormat;

    /**
     * Format for FontFamilyFormat
     */
    fontFamily: FontFamilyFormat;

    /**
     * Format for FontSizeFormat
     */
    fontSize: FontSizeFormat;

    /**
     * Format for HtmlAlignFormat
     */
    htmlAlign: HtmlAlignFormat;

    /**
     * Format for IdFormat
     */
    id: IdFormat;

    /**
     * Format for ItalicFormat
     */
    italic: ItalicFormat;

    /**
     * Format for LetterSpacingFormat
     */
    letterSpacing: LetterSpacingFormat;

    /**
     * Format for LineHeightFormat
     */
    lineHeight: LineHeightFormat;

    /**
     * Format for LinkFormat
     */
    link: LinkFormat;

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
     * Format for ListStylePositionFormat (used by list level)
     */
    listStylePosition: ListStylePositionFormat;

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
     * Format for TableLayout
     */
    tableLayout: TableLayoutFormat;

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
     * Format for TextColorFormat, for Table Cell only
     */
    textColorOnTableCell: TextColorFormat;

    /**
     * Format for UnderlineFormat
     */
    underline: UnderlineFormat;

    /**
     * Format for VerticalAlignFormat
     */
    verticalAlign: VerticalAlignFormat;

    /**
     * Format for WhiteSpaceFormat
     */
    whiteSpace: WhiteSpaceFormat;

    /**
     * Format for WordBreakFormat
     */
    wordBreak: WordBreakFormat;
}

/**
 * Key of all format handler
 */
export type FormatKey = keyof FormatHandlerTypeMap;
