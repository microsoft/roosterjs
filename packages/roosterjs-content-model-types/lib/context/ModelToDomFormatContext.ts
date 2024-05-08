import type { ContentModelListItemLevelFormatCommon } from '../contentModel/format/ContentModelListItemLevelFormat';
import type { ContentModelWithDataset } from '../contentModel/format/ContentModelWithDataset';
import type { ContentModelWithFormat } from '../contentModel/format/ContentModelWithFormat';
import type { ListMetadataFormat } from '../contentModel/format/metadata/ListMetadataFormat';
import type { ContentModelBlockFormatCommon } from '../contentModel/format/ContentModelBlockFormat';
import type { ContentModelListLevelCommon } from '../contentModel/decorator/ContentModelListLevel';
import type { ContentModelSegmentFormatCommon } from '../contentModel/format/ContentModelSegmentFormat';

/**
 * Represents a list stack item used by Content Model to DOM conversion
 */
export interface ModelToDomListStackItem
    extends Partial<ContentModelListLevelCommon>,
        Partial<ContentModelWithFormat<ContentModelListItemLevelFormatCommon>>,
        Partial<ContentModelWithDataset<ListMetadataFormat>> {
    /**
     * DOM node of this list stack
     */
    node: Node;
}

/**
 * Represents context for list handling
 */
export interface ModelToDomListContext {
    /**
     * Current number of each level of current thread
     */
    threadItemCounts: number[];

    /**
     * A stack of current list element chain, start from the parent node of top level list
     */
    nodeStack: ModelToDomListStackItem[];
}

/**
 * Represents format context used by Content Model to DOM conversion
 */
export interface ModelToDomFormatContext {
    /**
     * Context for list handling
     */
    listFormat: ModelToDomListContext;

    /**
     * Existing format implicitly applied from parent element
     */
    implicitFormat: ContentModelSegmentFormatCommon & ContentModelBlockFormatCommon;
}
