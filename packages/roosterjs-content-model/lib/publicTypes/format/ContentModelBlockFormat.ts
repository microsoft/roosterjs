import { BackgroundColorFormat } from './formatParts/BackgroundColorFormat';
import { DirectionFormat } from './formatParts/DirectionFormat';

/**
 * The format object for a block in Content Model
 */
export type ContentModelBlockFormat = BackgroundColorFormat & DirectionFormat;
