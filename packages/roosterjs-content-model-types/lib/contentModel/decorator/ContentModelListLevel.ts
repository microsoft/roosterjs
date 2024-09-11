import type { ContentModelBlockWithCache } from '../common/ContentModelBlockWithCache';
import type { MutableMark, ReadonlyMark } from '../common/MutableMark';
import type { ContentModelListItemLevelFormat } from '../format/ContentModelListItemLevelFormat';
import type {
    ContentModelWithDataset,
    ReadonlyContentModelWithDataset,
} from '../format/ContentModelWithDataset';
import type {
    ContentModelWithFormat,
    ReadonlyContentModelWithFormat,
} from '../format/ContentModelWithFormat';
import type { ListMetadataFormat } from '../format/metadata/ListMetadataFormat';

/**
 * Common part of Content Model of List Level
 */
export interface ContentModelListLevelCommon {
    /**
     * Type of a list, order (OL) or unordered (UL)
     */
    listType: 'OL' | 'UL';
}

/**
 * Content Model of List Level
 */
export interface ContentModelListLevel
    extends MutableMark,
        ContentModelBlockWithCache<HTMLOListElement | HTMLUListElement>,
        ContentModelListLevelCommon,
        ContentModelWithFormat<ContentModelListItemLevelFormat>,
        ContentModelWithDataset<ListMetadataFormat> {}

/**
 * Content Model of List Level (Readonly)
 */
export interface ReadonlyContentModelListLevel
    extends ReadonlyMark,
        ContentModelBlockWithCache<HTMLOListElement | HTMLUListElement>,
        ReadonlyContentModelWithFormat<ContentModelListItemLevelFormat>,
        ReadonlyContentModelWithDataset<ListMetadataFormat>,
        Readonly<ContentModelListLevelCommon> {}
