import type { Mutable } from '../common/Mutable';
import type { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import type { BoldFormat } from './formatParts/BoldFormat';
import type { FontFamilyFormat } from './formatParts/FontFamilyFormat';
import type { FontSizeFormat } from './formatParts/FontSizeFormat';
import type { ItalicFormat } from './formatParts/ItalicFormat';
import type { LetterSpacingFormat } from './formatParts/LetterSpacingFormat';
import type { LineHeightFormat } from './formatParts/LineHeightFormat';
import type { StrikeFormat } from './formatParts/StrikeFormat';
import type { SuperOrSubScriptFormat } from './formatParts/SuperOrSubScriptFormat';
import type { TextColorFormat } from './formatParts/TextColorFormat';
import type { UnderlineFormat } from './formatParts/UnderlineFormat';

/**
 * Common part of format object for a segment in Content Model
 */
export type ContentModelSegmentFormatCommon = TextColorFormat &
    BackgroundColorFormat &
    LetterSpacingFormat &
    FontSizeFormat &
    FontFamilyFormat &
    BoldFormat &
    ItalicFormat &
    UnderlineFormat &
    StrikeFormat &
    SuperOrSubScriptFormat &
    LineHeightFormat;

/**
 * The format object for a segment in Content Model
 */
export type ContentModelSegmentFormat = Mutable & ContentModelSegmentFormatCommon;

/**
 * The format object for a segment in Content Model (Readonly)
 */
export type ReadonlyContentModelSegmentFormat = Readonly<ContentModelSegmentFormatCommon>;
