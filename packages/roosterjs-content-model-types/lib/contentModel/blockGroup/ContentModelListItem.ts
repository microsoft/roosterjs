import type { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import type { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import type { ContentModelListItemFormat } from '../format/ContentModelListItemFormat';
import type { ContentModelListLevel } from '../decorator/ContentModelListLevel';
import type { ContentModelSelectionMarker } from '../segment/ContentModelSelectionMarker';
import type { ReadonlyContentModel } from '../common/Mutable';

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
export type ReadonlyContentModelListItem = ReadonlyContentModel<ContentModelListItem>;
