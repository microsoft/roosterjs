import type { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import type { BoldFormat } from './formatParts/BoldFormat';
import type { BorderBoxFormat } from './formatParts/BorderBoxFormat';
import type { BorderFormat } from './formatParts/BorderFormat';
import type { BoxShadowFormat } from './formatParts/BoxShadowFormat';
import type { ContentModelEntityFormat } from './ContentModelEntityFormat';
import type { DatasetFormat } from './metadata/DatasetFormat';
import type { DirectionFormat } from './formatParts/DirectionFormat';
import type { DisplayFormat } from './formatParts/DisplayFormat';
import type { FloatFormat } from './formatParts/FloatFormat';
import type { FontFamilyFormat } from './formatParts/FontFamilyFormat';
import type { FontSizeFormat } from './formatParts/FontSizeFormat';
import type { HtmlAlignFormat } from './formatParts/HtmlAlignFormat';
import type { IdFormat } from './formatParts/IdFormat';
import type { ItalicFormat } from './formatParts/ItalicFormat';
import type { LetterSpacingFormat } from './formatParts/LetterSpacingFormat';
import type { LineHeightFormat } from './formatParts/LineHeightFormat';
import type { LinkFormat } from './formatParts/LinkFormat';
import type { ListStylePositionFormat } from './formatParts/ListStylePositionFormat';
import type { ListThreadFormat } from './formatParts/ListThreadFormat';
import type { MarginFormat } from './formatParts/MarginFormat';
import type { PaddingFormat } from './formatParts/PaddingFormat';
import type { SizeFormat } from './formatParts/SizeFormat';
import type { SpacingFormat } from './formatParts/SpacingFormat';
import type { StrikeFormat } from './formatParts/StrikeFormat';
import type { SuperOrSubScriptFormat } from './formatParts/SuperOrSubScriptFormat';
import type { TableLayoutFormat } from './formatParts/TableLayoutFormat';
import type { TextAlignFormat } from './formatParts/TextAlignFormat';
import type { TextColorFormat } from './formatParts/TextColorFormat';
import type { UnderlineFormat } from './formatParts/UnderlineFormat';
import type { VerticalAlignFormat } from './formatParts/VerticalAlignFormat';
import type { WhiteSpaceFormat } from './formatParts/WhiteSpaceFormat';
import type { WordBreakFormat } from './formatParts/WordBreakFormat';

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
     * Format for ContentModelEntityFormat
     */
    entity: ContentModelEntityFormat;

    /**
     * Format for FloatFormat
     */
    float: FloatFormat;

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
     * Format for ListThreadFormat (used by list item)
     */
    listItemThread: ListThreadFormat;

    /**
     * Format for ListThreadFormat (used by list level)
     */
    listLevelThread: ListThreadFormat;

    /**
     * Format for ListStylePositionFormat (used by list level)
     */
    listStylePosition: ListStylePositionFormat;

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
