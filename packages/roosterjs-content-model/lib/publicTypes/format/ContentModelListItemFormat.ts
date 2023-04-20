import { DirectionFormat } from './formatParts/DirectionFormat';
import { LineHeightFormat } from './formatParts/LineHeightFormat';

/**
 * The format object for a list item in Content Model
 */
export type ContentModelListItemFormat = DirectionFormat & LineHeightFormat;
