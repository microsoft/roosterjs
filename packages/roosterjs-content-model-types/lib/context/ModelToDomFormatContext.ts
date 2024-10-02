import type { ContentModelBlockFormat } from '../contentModel/format/ContentModelBlockFormat';
import type { ContentModelListLevel } from '../contentModel/decorator/ContentModelListLevel';
import type { ContentModelSegmentFormat } from '../contentModel/format/ContentModelSegmentFormat';

/**
 * Represents a list stack item used by Content Model to DOM conversion
 */
export interface ModelToDomListStackItem extends Partial<ContentModelListLevel> {
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
 * Represents context for table handling
 */
export interface ModelToDomTableFormatContext {
    /**
     * When true, it means that the padding of the inner cells of the table should not be set.
     * As the value of all the inner cells padding is the same. So the cellpadding attribute was set in the table
     */
    alreadyWroteCellPadding?: boolean;
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

    /**
     * Context for table handling
     */
    tableFormat?: ModelToDomTableFormatContext;
}
