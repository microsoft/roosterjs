import { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import { ContentModelGeneralBlock } from '../block/group/ContentModelGeneralBlock';
import { ContentModelSegmentBase } from './ContentModelSegmentBase';
import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Content Model of general Segment
 */
export interface ContentModelGeneralSegment
    extends ContentModelGeneralBlock,
        ContentModelSegmentBase<'General', ContentModelBlockFormat & ContentModelSegmentFormat> {}
