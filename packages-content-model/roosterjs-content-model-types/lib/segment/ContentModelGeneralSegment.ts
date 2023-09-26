import type { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import type { ContentModelGeneralBlock } from '../group/ContentModelGeneralBlock';
import type { ContentModelSegmentBase } from './ContentModelSegmentBase';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Content Model of general Segment
 */
export interface ContentModelGeneralSegment
    extends ContentModelGeneralBlock,
        ContentModelSegmentBase<'General', ContentModelBlockFormat & ContentModelSegmentFormat> {}
