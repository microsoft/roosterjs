import type { ContentModelBr, ReadonlyContentModelBr } from './ContentModelBr';
import type { ContentModelEntity } from '../entity/ContentModelEntity';
import type {
    ContentModelGeneralSegment,
    ReadonlyContentModelGeneralSegment,
    ShallowMutableContentModelGeneralSegment,
} from './ContentModelGeneralSegment';
import type { ContentModelImage, ReadonlyContentModelImage } from './ContentModelImage';
import type {
    ContentModelSelectionMarker,
    ReadonlyContentModelSelectionMarker,
} from './ContentModelSelectionMarker';
import type { ContentModelText, ReadonlyContentModelText } from './ContentModelText';

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

/**
 * Union type of Content Model Segment (Readonly)
 */
export type ReadonlyContentModelSegment =
    | ReadonlyContentModelSelectionMarker
    | ReadonlyContentModelText
    | ReadonlyContentModelBr
    | ReadonlyContentModelGeneralSegment
    | ContentModelEntity
    | ReadonlyContentModelImage;

/**
 * Union type of Content Model Segment (Shallow mutable)
 */
export type ShallowMutableContentModelSegment =
    | ContentModelSelectionMarker
    | ContentModelText
    | ContentModelBr
    | ShallowMutableContentModelGeneralSegment
    | ContentModelEntity
    | ContentModelImage;
