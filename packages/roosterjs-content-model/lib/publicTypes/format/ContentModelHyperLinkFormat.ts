import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { BorderFormat } from './formatParts/BorderFormat';
import { DisplayFormat } from './formatParts/DisplayFormat';
import { LinkFormat } from './formatParts/LinkFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { PaddingFormat } from './formatParts/PaddingFormat';
import { SizeFormat } from './formatParts/SizeFormat';
import { TextAlignFormat } from './formatParts/TextAlignFormat';
import { TextColorFormat } from './formatParts/TextColorFormat';
import { UnderlineFormat } from './formatParts/UnderlineFormat';

/**
 * The format object for a hyperlink in Content Model
 */
export type ContentModelHyperLinkFormat = LinkFormat &
    TextColorFormat &
    BackgroundColorFormat &
    UnderlineFormat &
    DisplayFormat &
    MarginFormat &
    PaddingFormat &
    BorderFormat &
    SizeFormat &
    TextAlignFormat;
