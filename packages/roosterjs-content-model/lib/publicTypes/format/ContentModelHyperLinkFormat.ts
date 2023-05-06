import { DisplayFormat } from './formatParts/DisplayFormat';
import { LinkFormat } from './formatParts/LinkFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { PaddingFormat } from './formatParts/PaddingFormat';
import { TextColorFormat } from './formatParts/TextColorFormat';
import { UnderlineFormat } from './formatParts/UnderlineFormat';

/**
 * The format object for a hyperlink in Content Model
 */
export type ContentModelHyperLinkFormat = LinkFormat &
    TextColorFormat &
    UnderlineFormat &
    DisplayFormat &
    MarginFormat &
    PaddingFormat;
