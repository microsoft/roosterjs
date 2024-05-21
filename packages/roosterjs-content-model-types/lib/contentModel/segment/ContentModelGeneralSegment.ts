import type { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import type {
    ContentModelGeneralBlock,
    ReadonlyContentModelGeneralBlock,
    ShallowMutableContentModelGeneralBlock,
} from '../blockGroup/ContentModelGeneralBlock';
import type {
    ContentModelSegmentBase,
    ReadonlyContentModelSegmentBase,
    ShallowMutableContentModelSegmentBase,
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
 * Content Model of general Segment (Shallow mutable)
 */
export interface ShallowMutableContentModelGeneralSegment
    extends ShallowMutableContentModelGeneralBlock,
        ShallowMutableContentModelSegmentBase<
            'General',
            ContentModelBlockFormat & ContentModelSegmentFormat
        > {}
