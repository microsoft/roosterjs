import type { ReadonlyContentModel } from '../common/Mutable';
import type { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import type { ContentModelGeneralBlock } from '../blockGroup/ContentModelGeneralBlock';
import type { ContentModelSegmentBase } from './ContentModelSegmentBase';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Content Model of general segment
 */
export interface ContentModelGeneralSegment
    extends ContentModelGeneralBlock,
        ContentModelSegmentBase<'General', ContentModelBlockFormat & ContentModelSegmentFormat> {}

/**
 * Content Model of general segment (Readonly)
 */
export type ReadonlyContentModelGeneralSegment = ReadonlyContentModel<ContentModelGeneralSegment>;
