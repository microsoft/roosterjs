import { EditStep } from './EditStep';

/**
 * @internal
 * if we end up with multiple paragraphs impacted, we need to merge them
 */
export const mergeAfterDelete: EditStep = context => {
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
