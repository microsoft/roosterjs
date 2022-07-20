import { ContentModelGeneralSegment } from './ContentModelGeneralSegment';
import { ContentModelText } from './ContentModelText';

/**
 * Union type of Content Model Segment
 */
export type ContentModelSegment = ContentModelText | ContentModelGeneralSegment;
