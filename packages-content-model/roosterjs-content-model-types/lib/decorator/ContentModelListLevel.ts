import { ContentModelListItemLevelFormat } from '../format/ContentModelListItemLevelFormat';
import { ContentModelWithDataset } from '../format/ContentModelWithDataset';
import { ContentModelWithFormat } from '../format/ContentModelWithFormat';
import { ListMetadataFormat } from '../format/metadata/ListMetadataFormat';

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
