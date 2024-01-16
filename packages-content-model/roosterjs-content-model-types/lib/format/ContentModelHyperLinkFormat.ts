import type { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import type { BorderFormat } from './formatParts/BorderFormat';
import type { DisplayFormat } from './formatParts/DisplayFormat';
import type { LinkFormat } from './formatParts/LinkFormat';
import type { MarginFormat } from './formatParts/MarginFormat';
import type { PaddingFormat } from './formatParts/PaddingFormat';
import type { SizeFormat } from './formatParts/SizeFormat';
import type { TextAlignFormat } from './formatParts/TextAlignFormat';
import type { TextColorFormat } from './formatParts/TextColorFormat';
import type { UnderlineFormat } from './formatParts/UnderlineFormat';

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
