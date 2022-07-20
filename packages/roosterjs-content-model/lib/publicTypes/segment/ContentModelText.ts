import { ContentModelSegmentBase } from './ContentModelSegmentBase';
import { ContentModelSegmentType } from '../enum/SegmentType';
import type { CompatibleContentModelSegmentType } from '../compatibleEnum/SegmentType';

/**
 * Content Model for Text
 */
export interface ContentModelText
    extends ContentModelSegmentBase<
        ContentModelSegmentType.Text | CompatibleContentModelSegmentType.Text
    > {
    /**
     * Text content of this segment
     */
    text: string;
}
