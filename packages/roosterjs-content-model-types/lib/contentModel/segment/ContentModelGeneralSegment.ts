import type { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import type {
    ContentModelGeneralBlock,
    MutableContentModelGeneralBlock,
    ReadonlyContentModelGeneralBlock,
} from '../blockGroup/ContentModelGeneralBlock';
import type {
    ContentModelSegmentBase,
    ReadonlyContentModelSegmentBase,
} from './ContentModelSegmentBase';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Content Model of general Segment
 */
export interface ContentModelGeneralSegment
    extends ContentModelGeneralBlock,
        ContentModelSegmentBase<'General', ContentModelBlockFormat & ContentModelSegmentFormat> {}

/**
 * Content Model of general Segment (Readonly)
 */
export interface ReadonlyContentModelGeneralSegment
    extends ReadonlyContentModelGeneralBlock,
        ReadonlyContentModelSegmentBase<
            'General',
            ContentModelBlockFormat & ContentModelSegmentFormat
        > {}

/**
 * Content Model of general Segment (Single level mutable)
 */
export interface MutableContentModelGeneralSegment
    extends MutableContentModelGeneralBlock,
        ContentModelSegmentBase<'General', ContentModelBlockFormat & ContentModelSegmentFormat> {}
