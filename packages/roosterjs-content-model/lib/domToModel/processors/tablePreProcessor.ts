import { contains } from 'roosterjs-editor-dom';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { entityProcessor } from './entityProcessor';
import { hasMetadata } from '../../domUtils/metadata/updateMetadata';
import { tableProcessor } from './tableProcessor';

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
    return hasMetadata(element) || context.isInSelection || hasSelectionInTable(element, context);
}

function hasSelectionInTable(element: HTMLTableElement, context: DomToModelContext) {
    const selectedNodes = [
        context.imageSelection?.image,
        context.tableSelection?.table,
        context.regularSelection?.startContainer,
        context.regularSelection?.endContainer,
    ];

    return selectedNodes.some(n => contains(element, n, true /*treatSameNodeAsContain*/));
}
