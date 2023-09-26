import type { DirectionFormat } from './formatParts/DirectionFormat';
import type { ListStylePositionFormat } from './formatParts/ListStylePositionFormat';
import type { ListThreadFormat } from './formatParts/ListThreadFormat';
import type { MarginFormat } from './formatParts/MarginFormat';
import type { PaddingFormat } from './formatParts/PaddingFormat';
import type { TextAlignFormat } from './formatParts/TextAlignFormat';

/**
 * The format object for a list level in Content Model
 */
export type ContentModelListItemLevelFormat = ListThreadFormat &
    DirectionFormat &
    TextAlignFormat &
    MarginFormat &
    PaddingFormat &
    ListStylePositionFormat;
