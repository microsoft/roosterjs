import type { ContentModelListItemLevelFormat } from '../format/ContentModelListItemLevelFormat';
import type { ContentModelWithDataset } from '../format/ContentModelWithDataset';
import type { ContentModelWithFormat } from '../format/ContentModelWithFormat';
import type { ListMetadataFormat } from '../format/metadata/ListMetadataFormat';

/**
 * Content Model of List Level
 */
export interface ContentModelListLevel
    extends ContentModelWithFormat<ContentModelListItemLevelFormat>,
        ContentModelWithDataset<ListMetadataFormat> {
    /**
     * Type of a list, order (OL) or unordered (UL)
     */
    listType: 'OL' | 'UL';
}
