import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { BorderFormat } from './formatParts/BorderFormat';
import { DirectionFormat } from './formatParts/DirectionFormat';
import { HtmlAlignFormat } from './formatParts/HtmlAlignFormat';
import { LineHeightFormat } from './formatParts/LineHeightFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { PaddingFormat } from './formatParts/PaddingFormat';
import { TextAlignFormat } from './formatParts/TextAlignFormat';
import { WhiteSpaceFormat } from './formatParts/WhiteSpaceFormat';

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
