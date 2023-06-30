import { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import { Selectable } from '../selection/Selectable';

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
