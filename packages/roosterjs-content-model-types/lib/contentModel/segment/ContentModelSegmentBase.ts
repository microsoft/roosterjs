import type { ContentModelCode } from '../decorator/ContentModelCode';
import type { ContentModelLink } from '../decorator/ContentModelLink';
import type {
    ContentModelSegmentFormat,
    ReadonlyContentModelSegmentFormat,
} from '../format/ContentModelSegmentFormat';
import type { ContentModelSegmentType } from './SegmentType';
import type {
    ContentModelWithFormat,
    ReadonlyContentModelWithFormat,
} from '../format/ContentModelWithFormat';
import type { Selectable } from '../common/Selectable';

export interface ContentModelSegmentBaseCommon<T extends ContentModelSegmentType> {
    /**
     * Type of this segment
     */
    readonly segmentType: T;

    /**
     * Hyperlink info
     */
    link?: ContentModelLink;

    /**
     * Code info
     */
    code?: ContentModelCode;
}

/**
 * Base type of Content Model Segment
 */
export interface ContentModelSegmentBase<
    T extends ContentModelSegmentType,
    TFormat extends ContentModelSegmentFormat = ContentModelSegmentFormat
> extends Selectable, ContentModelWithFormat<TFormat>, ContentModelSegmentBaseCommon<T> {}

export interface ReadonlyContentModelSegmentBase<
    T extends ContentModelSegmentType,
    TFormat extends ReadonlyContentModelSegmentFormat = ReadonlyContentModelSegmentFormat
>
    extends Readonly<Selectable>,
        ReadonlyContentModelWithFormat<TFormat>,
        Readonly<ContentModelSegmentBaseCommon<T>> {}
