import type { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import type { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import type { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import type { Selectable } from '../common/Selectable';
import type { ReadonlyContentModel } from '../common/Mutable';

/**
 * Content Model for general Block element
 */
export interface ContentModelGeneralBlock
    extends Selectable,
        ContentModelBlockGroupBase<'General'>,
        ContentModelBlockBase<'BlockGroup', ContentModelBlockFormat & ContentModelSegmentFormat> {
    /**
     * A reference to original HTML node that this model was created from
     */
    element: HTMLElement;
}

/**
 * Content Model document general Block element (Readonly)
 */
export type ReadonlyContentModelGeneralBlock = ReadonlyContentModel<ContentModelGeneralBlock>;
