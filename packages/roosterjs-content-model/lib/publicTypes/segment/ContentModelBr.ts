import { ContentModelSegmentBase } from './ContentModelSegmentBase';
import { ContentModelSegmentType } from '../enum/SegmentType';
import type { CompatibleContentModelSegmentType } from '../compatibleEnum/SegmentType';

/**
 * Content Model of BR
 */
export interface ContentModelBr
    extends ContentModelSegmentBase<
        ContentModelSegmentType.Br | CompatibleContentModelSegmentType.Br
    > {}
