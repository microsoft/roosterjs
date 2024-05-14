import type {
    ContentModelBlockBase,
    ReadonlyContentModelBlockBase,
} from '../block/ContentModelBlockBase';
import type { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import type {
    ContentModelBlockGroupBase,
    ReadonlyContentModelBlockGroupBase,
} from './ContentModelBlockGroupBase';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import type { ReadonlySelectable, Selectable } from '../common/Selectable';

/**
 * Common part of Content Model for general Block element
 */
export interface ContentModelGeneralBlockCommon {
    /**
     * A reference to original HTML node that this model was created from
     */
    element: HTMLElement;
}

/**
 * Content Model for general Block element
 */
export interface ContentModelGeneralBlock
    extends Selectable,
        ContentModelGeneralBlockCommon,
        ContentModelBlockGroupBase<'General'>,
        ContentModelBlockBase<'BlockGroup', ContentModelBlockFormat & ContentModelSegmentFormat> {}

/**
 * Content Model for general Block element (Readonly)
 */
export interface ReadonlyContentModelGeneralBlock
    extends ReadonlySelectable,
        ReadonlyContentModelBlockGroupBase<'General'>,
        ReadonlyContentModelBlockBase<
            'BlockGroup',
            ContentModelBlockFormat & ContentModelSegmentFormat
        >,
        Readonly<ContentModelGeneralBlockCommon> {}
