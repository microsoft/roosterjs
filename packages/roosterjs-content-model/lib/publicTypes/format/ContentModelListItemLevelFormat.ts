import { DirectionFormat } from './formatParts/DirectionFormat';
import { ListMetadataFormat } from './formatParts/ListMetadataFormat';
import { ListThreadFormat } from './formatParts/ListThreadFormat';
import { ListTypeFormat } from './formatParts/ListTypeFormat';
import { MarginFormat } from './formatParts/MarginFormat';

/**
 * The format object for a list level in Content Model
 */
export type ContentModelListItemLevelFormat = ListTypeFormat &
    ListThreadFormat &
    ListMetadataFormat &
    DirectionFormat &
    MarginFormat;
