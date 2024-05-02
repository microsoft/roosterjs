import type { ContentModelParagraph } from '../block/ContentModelParagraph';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';

/**
 * Context object used by DomIndexer when reconcile mutations with child list
 */
export interface ReconcileChildListContext {
    /**
     * Index of segment in current paragraph
     */
    segIndex: number;

    /**
     * The current paragraph that we are handling
     */
    paragraph?: ContentModelParagraph;

    /**
     * Text node that is added from mutation but has not been handled. This can happen when we first see an added node then later we see a removed one.
     * e.g. Type text in an empty paragraph (&lt;div&gt;&lt;br&gt;&lt;/div&gt;), so a text node will be added and &lt;BR&gt; will be removed.
     * Set to a valid text node means we need to handle it later. If it is finally not handled, that means we need to clear cache
     * Set to undefined (initial value) means no pending text node is hit yet (valid case)
     * Set to null means there was a pending text node which is already handled, so if we see another pending text node,
     * we should clear cache since we don't know how to handle it
     */
    pendingTextNode?: Text | null;

    /**
     * Format of the removed segment, this will be used as the format for newly created segment
     */
    format?: ContentModelSegmentFormat;
}
