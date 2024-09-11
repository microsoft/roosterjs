import type {
    ContentModelBlockBase,
    ReadonlyContentModelBlockBase,
    ShallowMutableContentModelBlockBase,
} from '../block/ContentModelBlockBase';
import type { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import type {
    ContentModelBlockGroupBase,
    ShallowMutableContentModelBlockGroupBase,
    ReadonlyContentModelBlockGroupBase,
} from './ContentModelBlockGroupBase';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import type {
    ReadonlySelectable,
    Selectable,
    ShallowMutableSelectable,
} from '../common/Selectable';

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
        Readonly<ContentModelGeneralBlockCommon>,
        ReadonlyContentModelBlockGroupBase<'General'>,
        ReadonlyContentModelBlockBase<
            'BlockGroup',
            ContentModelBlockFormat & ContentModelSegmentFormat
        > {}

/**
 * Content Model for general Block element (Shallow mutable)
 */
export interface ShallowMutableContentModelGeneralBlock
    extends ShallowMutableSelectable,
        ContentModelGeneralBlockCommon,
        ShallowMutableContentModelBlockGroupBase<'General'>,
        ShallowMutableContentModelBlockBase<
            'BlockGroup',
            ContentModelBlockFormat & ContentModelSegmentFormat
        > {}
