import type {
    ContentModelBlockBase,
    ReadonlyContentModelBlockBase,
} from '../block/ContentModelBlockBase';
import type {
    ContentModelBlockGroupBase,
    MutableContentModelBlockGroupBase,
    ReadonlyContentModelBlockGroupBase,
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
 * Content Model of List Item (Single level mutable)
 */
export interface MutableContentModelListItem
    extends MutableContentModelBlockGroupBase<'ListItem', HTMLLIElement>,
        ContentModelBlockBase<'BlockGroup', ContentModelListItemFormat, HTMLLIElement> {
    /**
     * Type of this list, either ordered or unordered
     */
    readonly levels: ReadonlyArray<ReadonlyContentModelListLevel>;

    /**
     * A dummy segment to hold format of this list item
     */
    readonly formatHolder: ReadonlyContentModelSelectionMarker;
}
