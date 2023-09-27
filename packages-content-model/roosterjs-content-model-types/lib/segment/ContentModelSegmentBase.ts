import type { ContentModelCode } from '../decorator/ContentModelCode';
import type { ContentModelLink } from '../decorator/ContentModelLink';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import type { ContentModelSegmentType } from '../enum/SegmentType';
import type { ContentModelWithFormat } from '../format/ContentModelWithFormat';
import type { Selectable } from '../selection/Selectable';

/**
 * Base type of Content Model Segment
 */
export interface ContentModelSegmentBase<
    T extends ContentModelSegmentType,
    TFormat extends ContentModelSegmentFormat = ContentModelSegmentFormat
> extends Selectable, ContentModelWithFormat<TFormat> {
    /**
     * Type of this segment
     */
    segmentType: T;

    /**
     * Hyperlink info
     */
    link?: ContentModelLink;

    /**
     * Code info
     */
    code?: ContentModelCode;
}
