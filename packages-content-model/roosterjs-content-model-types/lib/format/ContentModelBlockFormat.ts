import type { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import type { BorderFormat } from './formatParts/BorderFormat';
import type { DirectionFormat } from './formatParts/DirectionFormat';
import type { HtmlAlignFormat } from './formatParts/HtmlAlignFormat';
import type { LineHeightFormat } from './formatParts/LineHeightFormat';
import type { MarginFormat } from './formatParts/MarginFormat';
import type { PaddingFormat } from './formatParts/PaddingFormat';
import type { TextAlignFormat } from './formatParts/TextAlignFormat';
import type { WhiteSpaceFormat } from './formatParts/WhiteSpaceFormat';

/**
 * The format object for a paragraph in Content Model
 */
export type ContentModelBlockFormat = BackgroundColorFormat &
    DirectionFormat &
    TextAlignFormat &
    HtmlAlignFormat &
    MarginFormat &
    PaddingFormat &
    LineHeightFormat &
    WhiteSpaceFormat &
    BorderFormat;
