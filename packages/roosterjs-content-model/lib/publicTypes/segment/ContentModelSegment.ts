import { ContentModelBr } from './ContentModelBr';
import { ContentModelGeneralSegment } from './ContentModelGeneralSegment';
import { ContentModelSelectionMarker } from './ContentModelSelectionMarker';
import { ContentModelText } from './ContentModelText';

/**
 * Union type of Content Model Segment
 */
export type ContentModelSegment =
    | ContentModelSelectionMarker
    | ContentModelText
    | ContentModelBr
    | ContentModelGeneralSegment;
