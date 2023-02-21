import { ContentModelBr } from './ContentModelBr';
import { ContentModelEntity } from '../entity/ContentModelEntity';
import { ContentModelGeneralSegment } from './ContentModelGeneralSegment';
import { ContentModelImage } from './ContentModelImage';
import { ContentModelSelectionMarker } from './ContentModelSelectionMarker';
import { ContentModelText } from './ContentModelText';
import { ContentModelStyledText } from './ContentModelStyledText';

/**
 * Union type of Content Model Segment
 */
export type ContentModelSegment =
    | ContentModelSelectionMarker
    | ContentModelText
    | ContentModelStyledText
    | ContentModelBr
    | ContentModelGeneralSegment
    | ContentModelEntity
    | ContentModelImage;
