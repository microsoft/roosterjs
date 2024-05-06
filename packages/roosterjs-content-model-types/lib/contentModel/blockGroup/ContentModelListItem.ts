import type {
    ContentModelBlockBase,
    ReadonlyContentModelBlockBase,
} from '../block/ContentModelBlockBase';
import type {
    ContentModelBlockGroupBase,
    ReadonlyContentModelBlockGroupBase,
} from './ContentModelBlockGroupBase';
import type {
    ContentModelListItemFormat,
    ReadonlyContentModelListItemFormat,
} from '../format/ContentModelListItemFormat';
import type { ContentModelListLevel } from '../decorator/ContentModelListLevel';
import type {
    ContentModelSelectionMarker,
    ReadonlyContentModelSelectionMarker,
} from '../segment/ContentModelSelectionMarker';

/**
 * Content Model of List Item
 */
export interface ContentModelListItem
    extends ContentModelBlockGroupBase<'ListItem'>,
        ContentModelBlockBase<'BlockGroup', ContentModelListItemFormat> {
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
    extends ReadonlyContentModelBlockGroupBase<'ListItem'>,
        ReadonlyContentModelBlockBase<'BlockGroup', ReadonlyContentModelListItemFormat> {
    /**
     * Type of this list, either ordered or unordered
     */
    readonly levels: ReadonlyArray<ContentModelListLevel>;

    /**
     * A dummy segment to hold format of this list item
     */
    readonly formatHolder: ReadonlyContentModelSelectionMarker;
}
