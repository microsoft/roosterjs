import { DirectionFormat } from './formatParts/DirectionFormat';
import { DisplayFormat } from './formatParts/DisplayFormat';
import { ListMetadataFormat } from './formatParts/ListMetadataFormat';
import { ListThreadFormat } from './formatParts/ListThreadFormat';
import { ListTypeFormat } from './formatParts/ListTypeFormat';

/**
 * The format object for a list level in Content Model
 */
export type ContentModelListItemLevelFormat = ListTypeFormat &
    ListThreadFormat &
    ListMetadataFormat &
    DisplayFormat &
    DirectionFormat;
