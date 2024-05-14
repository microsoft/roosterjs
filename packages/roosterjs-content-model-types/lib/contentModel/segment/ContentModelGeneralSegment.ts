import type { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import type {
    ContentModelGeneralBlock,
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
