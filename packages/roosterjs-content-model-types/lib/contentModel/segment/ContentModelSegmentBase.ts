import type { MutableMark, ReadonlyMark, ShallowMutableMark } from '../common/MutableMark';
import type { ContentModelCode, ReadonlyContentModelCode } from '../decorator/ContentModelCode';
import type { ContentModelLink, ReadonlyContentModelLink } from '../decorator/ContentModelLink';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import type { ContentModelSegmentType } from './SegmentType';
import type {
    ContentModelWithFormat,
    ReadonlyContentModelWithFormat,
} from '../format/ContentModelWithFormat';
import type {
    ReadonlySelectable,
    Selectable,
    ShallowMutableSelectable,
} from '../common/Selectable';

/**
 * Common part of base type of Content Model Segment
 */
export interface ContentModelSegmentBaseCommon<T extends ContentModelSegmentType> {
    /**
     * Type of this segment
     */
    readonly segmentType: T;
}

/**
 * Base type of Content Model Segment
 */
export interface ContentModelSegmentBase<
    T extends ContentModelSegmentType,
    TFormat extends ContentModelSegmentFormat = ContentModelSegmentFormat
>
    extends MutableMark,
        Selectable,
        ContentModelWithFormat<TFormat>,
        ContentModelSegmentBaseCommon<T> {
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
 * Base type of Content Model Segment (Readonly)
 */
export interface ReadonlyContentModelSegmentBase<
    T extends ContentModelSegmentType,
    TFormat extends ContentModelSegmentFormat = ContentModelSegmentFormat
>
    extends ReadonlyMark,
        ReadonlySelectable,
        ReadonlyContentModelWithFormat<TFormat>,
        Readonly<ContentModelSegmentBaseCommon<T>> {
    /**
     * Hyperlink info
     */
    readonly link?: ReadonlyContentModelLink;

    /**
     * Code info
     */
    readonly code?: ReadonlyContentModelCode;
}

/**
 * Base type of Content Model Segment (Shallow mutable)
 */
export interface ShallowMutableContentModelSegmentBase<
    T extends ContentModelSegmentType,
    TFormat extends ContentModelSegmentFormat = ContentModelSegmentFormat
>
    extends ShallowMutableMark,
        ShallowMutableSelectable,
        ContentModelWithFormat<TFormat>,
        ContentModelSegmentBaseCommon<T> {
    /**
     * Hyperlink info
     */
    link?: ContentModelLink;

    /**
     * Code info
     */
    code?: ContentModelCode;
}
