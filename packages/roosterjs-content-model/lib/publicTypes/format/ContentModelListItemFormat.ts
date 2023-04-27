import { DirectionFormat } from './formatParts/DirectionFormat';
import { LineHeightFormat } from './formatParts/LineHeightFormat';
import { MarginFormat } from './formatParts/MarginFormat';

/**
 * The format object for a list item in Content Model
 */
export type ContentModelListItemFormat = DirectionFormat & LineHeightFormat & MarginFormat;
