import type { ContentModelBr } from './ContentModelBr';
import type { ContentModelEntity } from '../entity/ContentModelEntity';
import type { ContentModelGeneralSegment } from './ContentModelGeneralSegment';
import type { ContentModelImage } from './ContentModelImage';
import type { ContentModelSelectionMarker } from './ContentModelSelectionMarker';
import type { ContentModelText } from './ContentModelText';

/**
 * Union type of Content Model Segment
 */
export type ContentModelSegment =
    | ContentModelSelectionMarker
    | ContentModelText
    | ContentModelBr
    | ContentModelGeneralSegment
    | ContentModelEntity
    | ContentModelImage;
