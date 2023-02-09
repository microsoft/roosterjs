import { LinkFormat } from './formatParts/LinkFormat';
import { TextColorFormat } from './formatParts/TextColorFormat';
import { UnderlineFormat } from './formatParts/UnderlineFormat';

/**
 * The format object for a hyperlink in Content Model
 */
export type ContentModelHyperLinkFormat = LinkFormat & TextColorFormat & UnderlineFormat;
