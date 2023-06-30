import { DirectionFormat } from './formatParts/DirectionFormat';
import { LineHeightFormat } from './formatParts/LineHeightFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { PaddingFormat } from './formatParts/PaddingFormat';
import { TextAlignFormat } from './formatParts/TextAlignFormat';

/**
 * The format object for a list item in Content Model
 */
export type ContentModelListItemFormat = DirectionFormat &
    LineHeightFormat &
    MarginFormat &
    PaddingFormat &
    TextAlignFormat;
