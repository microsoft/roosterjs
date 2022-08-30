import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import { ContentModelSegmentType } from '../enum/SegmentType';
import { ContentModelWithFormat } from '../format/ContentModelWithFormat';

/**
 * Base type of Content Model Segment
 */
export interface ContentModelSegmentBase<T extends ContentModelSegmentType>
    extends ContentModelWithFormat<ContentModelSegmentFormat> {
    /**
     * Type of this segment
     */
    segmentType: T;

    /**
     * Whether this segment is selected
     */
    isSelected?: boolean;
}
