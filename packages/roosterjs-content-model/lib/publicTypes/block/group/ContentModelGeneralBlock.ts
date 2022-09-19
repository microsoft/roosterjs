import { ContentModelBlockBase } from '../ContentModelBlockBase';
import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';

/**
 * Content Model for general Block element
 */
export interface ContentModelGeneralBlock
    extends ContentModelBlockGroupBase<'General'>,
        ContentModelBlockBase<'BlockGroup'> {
    /**
     * A reference to original HTML node that this model was created from
     */
    element: HTMLElement;
}
