import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { DirectionFormat } from './formatParts/DirectionFormat';
import { LineHeightFormat } from './formatParts/LineHeightFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { PaddingFormat } from './formatParts/PaddingFormat';

/**
 * The format object for a paragraph in Content Model
 */
export type ContentModelBlockFormat = BackgroundColorFormat &
    DirectionFormat &
    MarginFormat &
    PaddingFormat &
    LineHeightFormat;
