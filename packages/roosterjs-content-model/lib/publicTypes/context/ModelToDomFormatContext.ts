import { ContentModelBlockFormat } from '../format/ContentModelBlockFormat';
import { ContentModelListItemLevelFormat } from '../format/ContentModelListItemLevelFormat';
import { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Represents a list stack item used by Content Model to DOM conversion
 */
export interface ModelToDomListStackItem extends ContentModelListItemLevelFormat {
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
    implicitFormat: ContentModelSegmentFormat & ContentModelBlockFormat;
}
