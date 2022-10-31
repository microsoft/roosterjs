import { ContentModelLinkFormat } from '../format/ContentModelLinkFormat';
import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import { ContentModelSegmentType } from '../enum/SegmentType';
import { ContentModelWithFormat } from '../format/ContentModelWithFormat';

/**
 * Base type of Content Model Segment
 */
export interface ContentModelSegmentBase<
    T extends ContentModelSegmentType,
    TFormat extends ContentModelSegmentFormat = ContentModelSegmentFormat
> extends ContentModelWithFormat<TFormat> {
    /**
     * Type of this segment
     */
    segmentType: T;

    /**
     * Whether this segment is selected
     */
    isSelected?: boolean;

    /**
     * Hyperlink info
     */
    link?: ContentModelLinkFormat;
}
