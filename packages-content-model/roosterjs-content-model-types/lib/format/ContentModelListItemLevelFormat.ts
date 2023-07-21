import { DirectionFormat } from './formatParts/DirectionFormat';
import { ListStylePositionFormat } from './formatParts/ListStylePositionFormat';
import { ListThreadFormat } from './formatParts/ListThreadFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { PaddingFormat } from './formatParts/PaddingFormat';
import { TextAlignFormat } from './formatParts/TextAlignFormat';

/**
 * The format object for a list level in Content Model
 */
export type ContentModelListItemLevelFormat = ListThreadFormat &
    DirectionFormat &
    TextAlignFormat &
    MarginFormat &
    PaddingFormat &
    ListStylePositionFormat;
