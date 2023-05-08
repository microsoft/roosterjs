import { contains } from 'roosterjs-editor-dom';
import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { entityProcessor } from './entityProcessor';
import { hasMetadata } from '../../domUtils/metadata/updateMetadata';
import { tableProcessor } from './tableProcessor';

export const tablePreProcessor: ElementProcessor<HTMLTableElement> = (group, element, context) => {
    const processor = shouldUseTableProcessor(element, context) ? tableProcessor : entityProcessor;

    processor(group, element, context);
};

function shouldUseTableProcessor(element: HTMLTableElement, context: DomToModelContext) {
    if (hasMetadata(element)) {
        return true;
    }

    const selectedTable = context.tableSelection?.table;

    if (selectedTable == element || contains(element, selectedTable)) {
        return true;
    }

    if (
        contains(
            element,
            context.regularSelection?.startContainer,
            true /*treatSameNodeAsContain*/
        ) ||
        contains(element, context.regularSelection?.endContainer, true /*treatSameNodeAsContain*/)
    ) {
        return true;
    }

    return false;
}
