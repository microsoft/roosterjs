import { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelListItemFormat } from '../format/ContentModelListItemFormat';
import { ContentModelListItemLevelFormat } from '../format/ContentModelListItemLevelFormat';
import { ContentModelSelectionMarker } from '../segment/ContentModelSelectionMarker';

/**
 * Content Model of List Item
 */
export interface ContentModelListItem
    extends ContentModelBlockGroupBase<'ListItem'>,
        ContentModelBlockBase<'BlockGroup', ContentModelListItemFormat> {
    /**
     * Type of this list, either ordered or unordered
     */
    levels: ContentModelListItemLevelFormat[];

    /**
     * A dummy segment to hold format of this list item
     */
    formatHolder: ContentModelSelectionMarker;
}
