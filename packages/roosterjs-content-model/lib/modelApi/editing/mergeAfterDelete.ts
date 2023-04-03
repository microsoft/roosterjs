import { DeleteSelectionStep } from './DeleteSelectionStep';

/**
 * @internal
 * Last step: If we end up with multiple paragraphs impacted, we need to merge them
 */
export const mergeAfterDelete: DeleteSelectionStep = context => {
    const { insertPoint, isChanged, lastParagraph, lastTableContext } = context;

    if (
        insertPoint &&
        isChanged &&
        lastParagraph &&
        lastParagraph != insertPoint.paragraph &&
        lastTableContext == insertPoint.tableContext
    ) {
        insertPoint.paragraph.segments.push(...lastParagraph.segments);
        lastParagraph.segments = [];
    }
};
