import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { BoldFormat } from './formatParts/BoldFormat';
import { DirectionFormat } from './formatParts/DirectionFormat';
import { FontFamilyFormat } from './formatParts/FontFamilyFormat';
import { FontSizeFormat } from './formatParts/FontSizeFormat';
import { ItalicFormat } from './formatParts/ItalicFormat';
import { LineHeightFormat } from './formatParts/LineHeightFormat';
import { ListPositionTypeFormat } from './formatParts/ListPositionTypeFormat';
import { StrikeFormat } from './formatParts/StrikeFormat';
import { SuperOrSubScriptFormat } from './formatParts/SuperOrSubScriptFormat';
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
    StrikeFormat &
    SuperOrSubScriptFormat &
    LineHeightFormat &
    ListPositionTypeFormat &
    DirectionFormat;
