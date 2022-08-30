import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { BoldFormat } from './formatParts/BoldFormat';
import { FontFamilyFormat } from './formatParts/FontFamilyFormat';
import { FontSizeFormat } from './formatParts/FontSizeFormat';
import { ItalicFormat } from './formatParts/ItalicFormat';
import { StrikeFormat } from './formatParts/StrikeFormat';
import { TextColorFormat } from './formatParts/TextColorFormat';
import { UnderlineFormat } from './formatParts/UnderlineFormat';

/**
 * The format object for a segment in Content Model
 */
export type ContentModelSegmentFormat = TextColorFormat &
    BackgroundColorFormat &
    FontSizeFormat &
    FontFamilyFormat &
    BoldFormat &
    ItalicFormat &
    UnderlineFormat &
    StrikeFormat;
