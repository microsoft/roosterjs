import { DirectionFormat } from './formatParts/DirectionFormat';
import { ListMetadataFormat } from './formatParts/ListMetadataFormat';
import { ListStylePositionFormat } from './formatParts/ListStylePositionFormat';
import { ListThreadFormat } from './formatParts/ListThreadFormat';
import { ListTypeFormat } from './formatParts/ListTypeFormat';
import { MarginFormat } from './formatParts/MarginFormat';
import { PaddingFormat } from './formatParts/PaddingFormat';
import { TextAlignFormat } from './formatParts/TextAlignFormat';

/**
 * The format object for a list level in Content Model
 */
export type ContentModelListItemLevelFormat = ListTypeFormat &
    ListThreadFormat &
    ListMetadataFormat &
    DirectionFormat &
    TextAlignFormat &
    MarginFormat &
    PaddingFormat &
    ListStylePositionFormat;
