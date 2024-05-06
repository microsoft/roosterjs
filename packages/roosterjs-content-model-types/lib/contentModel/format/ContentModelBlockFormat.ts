import type { Mutable } from '../common/Mutable';
import type { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import type { BorderFormat } from './formatParts/BorderFormat';
import type { DirectionFormat } from './formatParts/DirectionFormat';
import type { HtmlAlignFormat } from './formatParts/HtmlAlignFormat';
import type { LineHeightFormat } from './formatParts/LineHeightFormat';
import type { MarginFormat } from './formatParts/MarginFormat';
import type { PaddingFormat } from './formatParts/PaddingFormat';
import type { TextAlignFormat } from './formatParts/TextAlignFormat';
import type { TextIndentFormat } from './formatParts/TextIndentFormat';
import type { WhiteSpaceFormat } from './formatParts/WhiteSpaceFormat';

/**
 * Common part of format object for a paragraph in Content Model
 */
export type ContentModelBlockFormatCommon = BackgroundColorFormat &
    DirectionFormat &
    TextAlignFormat &
    HtmlAlignFormat &
    MarginFormat &
    PaddingFormat &
    LineHeightFormat &
    WhiteSpaceFormat &
    BorderFormat &
    TextIndentFormat;

/**
 * The format object for a paragraph in Content Model
 */
export type ContentModelBlockFormat = Mutable & ContentModelBlockFormatCommon;

/**
 * The format object for a paragraph in Content Model (Readonly)
 */
export type ReadonlyContentModelBlockFormat = Readonly<ContentModelBlockFormatCommon>;
