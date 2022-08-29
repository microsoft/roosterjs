import { ContentModelGeneralBlock } from '../block/group/ContentModelGeneralBlock';
import { ContentModelSegmentBase } from './ContentModelSegmentBase';

/**
 * Content Model of general Segment
 */
export interface ContentModelGeneralSegment
    extends ContentModelGeneralBlock,
        ContentModelSegmentBase<'General'> {}
