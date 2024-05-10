import type { ReadonlyContentModel } from '../common/Mutable';
import type { ContentModelSegmentBase } from './ContentModelSegmentBase';

/**
 * Content Model for Text
 */
export interface ContentModelText extends ContentModelSegmentBase<'Text'> {
    /**
     * Text content of this segment
     */
    text: string;
}

/**
 * Content Model of Text (Readonly)
 */
export type ReadonlyContentModelText = ReadonlyContentModel<ContentModelText>;
