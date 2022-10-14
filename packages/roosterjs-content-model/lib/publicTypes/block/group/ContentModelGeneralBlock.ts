import { ContentModelBlockBase } from '../ContentModelBlockBase';
import { ContentModelBlockFormat } from '../../format/ContentModelBlockFormat';
import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelSegmentFormat } from '../../format/ContentModelSegmentFormat';

/**
 * Content Model for general Block element
 */
export interface ContentModelGeneralBlock
    extends ContentModelBlockGroupBase<'General'>,
        ContentModelBlockBase<'BlockGroup', ContentModelBlockFormat & ContentModelSegmentFormat> {
    /**
     * A reference to original HTML node that this model was created from
     */
    element: HTMLElement;
}
