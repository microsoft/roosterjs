import { ContentModelGeneralBlock } from '../block/group/ContentModelGeneralBlock';
import { ContentModelSegmentBase } from './ContentModelSegmentBase';
import { ContentModelSegmentType } from '../enum/SegmentType';
import type { CompatibleContentModelSegmentType } from '../compatibleEnum/SegmentType';

/**
 * Content Model of general Segment
 */
export interface ContentModelGeneralSegment
    extends ContentModelGeneralBlock,
        ContentModelSegmentBase<
            ContentModelSegmentType.General | CompatibleContentModelSegmentType.General
        > {}
