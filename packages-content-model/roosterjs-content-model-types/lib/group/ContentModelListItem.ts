import { ContentModelBlockBase } from '../block/ContentModelBlockBase';
import { ContentModelBlockGroupBase } from './ContentModelBlockGroupBase';
import { ContentModelListItemFormat } from '../format/ContentModelListItemFormat';
import { ContentModelListLevel } from '../decorator/ContentModelListLevel';
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
    levels: ContentModelListLevel[];

    /**
     * A dummy segment to hold format of this list item
     */
    formatHolder: ContentModelSelectionMarker;
}
