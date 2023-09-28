import { contains } from 'roosterjs-editor-dom';
import { entityProcessor, hasMetadata, tableProcessor } from 'roosterjs-content-model-dom';
import { getSelectionRootNode } from '../../modelApi/selection/getSelectionRootNode';
import type { DomToModelContext, ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const tablePreProcessor: ElementProcessor<HTMLTableElement> = (group, element, context) => {
    const processor = shouldUseTableProcessor(element, context) ? tableProcessor : entityProcessor;

    processor(group, element, context);
};

function shouldUseTableProcessor(element: HTMLTableElement, context: DomToModelContext) {
    // Treat table as a real table when:
    // 1. It is a roosterjs table (has metadata)
    // 2. Table is in selection
    // 3. There is selection inside table (or whole table is selected)
    // Otherwise, we treat the table as entity so we will not change it when write back
    return (
        hasMetadata(element) ||
        context.isInSelection ||
        contains(element, getSelectionRootNode(context.selection), true /*treatSameNodeAsContain*/)
    );
}
