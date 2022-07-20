import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelBlockGroupType } from '../../enum/BlockGroupType';
import type { CompatibleContentModelBlockGroupType } from '../../compatibleEnum/BlockGroupType';

/**
 * Content Model for general Block element
 */
export interface ContentModelGeneralBlock
    extends ContentModelBlockGroupBase<
        ContentModelBlockGroupType.General | CompatibleContentModelBlockGroupType.General
    > {
    /**
     * A reference to original HTML node that this model was created from
     */
    element: HTMLElement;
}
