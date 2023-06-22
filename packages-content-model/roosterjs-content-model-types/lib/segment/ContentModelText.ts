import { ContentModelSegmentBase } from './ContentModelSegmentBase';

/**
 * Content Model for Text
 */
export interface ContentModelText extends ContentModelSegmentBase<'Text'> {
    /**
     * Text content of this segment
     */
    text: string;
}
