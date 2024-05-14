import type {
    ContentModelBlockBase,
    ReadonlyContentModelBlockBase,
    ShallowMutableContentModelBlockBase,
} from '../block/ContentModelBlockBase';
import type {
    ContentModelBlockGroupBase,
    ReadonlyContentModelBlockGroupBase,
    ShallowMutableContentModelBlockGroupBase,
} from './ContentModelBlockGroupBase';
import type { ContentModelListItemFormat } from '../format/ContentModelListItemFormat';
import type {
    ContentModelListLevel,
    ReadonlyContentModelListLevel,
} from '../decorator/ContentModelListLevel';
import type {
    ContentModelSelectionMarker,
    ReadonlyContentModelSelectionMarker,
} from '../segment/ContentModelSelectionMarker';

/**
 * Content Model of List Item
 */
export interface ContentModelListItem
    extends ContentModelBlockGroupBase<'ListItem', HTMLLIElement>,
        ContentModelBlockBase<'BlockGroup', ContentModelListItemFormat, HTMLLIElement> {
    /**
     * Type of this list, either ordered or unordered
     */
    levels: ContentModelListLevel[];

    /**
     * A dummy segment to hold format of this list item
     */
    formatHolder: ContentModelSelectionMarker;
}

/**
 * Content Model of List Item (Readonly)
 */
export interface ReadonlyContentModelListItem
    extends ReadonlyContentModelBlockGroupBase<'ListItem', HTMLLIElement>,
        ReadonlyContentModelBlockBase<'BlockGroup', ContentModelListItemFormat, HTMLLIElement> {
    /**
     * Type of this list, either ordered or unordered
     */
    readonly levels: ReadonlyArray<ReadonlyContentModelListLevel>;

    /**
     * A dummy segment to hold format of this list item
     */
    readonly formatHolder: ReadonlyContentModelSelectionMarker;
}

/**
 * Content Model of List Item (Shallow mutable)
 */
export interface ShallowMutableContentModelListItem
    extends ShallowMutableContentModelBlockGroupBase<'ListItem', HTMLLIElement>,
        ShallowMutableContentModelBlockBase<
            'BlockGroup',
            ContentModelListItemFormat,
            HTMLLIElement
        > {
    /**
     * Type of this list, either ordered or unordered
     */
    readonly levels: ReadonlyArray<ReadonlyContentModelListLevel>;

    /**
     * A dummy segment to hold format of this list item
     */
    formatHolder: ContentModelSelectionMarker;
}
