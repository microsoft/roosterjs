import { ContentModelCode } from '../decorator/ContentModelCode';
import { ContentModelLink } from '../decorator/ContentModelLink';
import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import { ContentModelSegmentType } from '../enum/SegmentType';
import { ContentModelWithFormat } from '../format/ContentModelWithFormat';
import { Selectable } from '../selection/Selectable';

/**
 * Base type of Content Model Segment
 */
export interface ContentModelSegmentBase<
    T extends ContentModelSegmentType,
    TFormat extends ContentModelSegmentFormat = ContentModelSegmentFormat
> extends ContentModelWithFormat<TFormat>, Selectable {
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
