import type { DirectionFormat } from './formatParts/DirectionFormat';
import type { LineHeightFormat } from './formatParts/LineHeightFormat';
import type { ListStyleFormat } from './formatParts/ListStyleFormat';
import type { MarginFormat } from './formatParts/MarginFormat';
import type { PaddingFormat } from './formatParts/PaddingFormat';
import type { TextAlignFormat } from './formatParts/TextAlignFormat';
import type { TextIndentFormat } from './formatParts/TextIndentFormat';

/**
 * The format object for a list item in Content Model
 */
export type ContentModelListItemFormat = DirectionFormat &
    LineHeightFormat &
    MarginFormat &
    PaddingFormat &
    TextAlignFormat &
    ListStyleFormat &
    TextIndentFormat;
