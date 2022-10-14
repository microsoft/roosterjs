import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { entityProcessor } from './entityProcessor';
import { generalProcessor } from './generalProcessor';
import { getEntityFromElement } from 'roosterjs-editor-dom';

/**
 * @internal
 * @param group
 * @param element
 * @param context
 */
export const singleElementProcessor: ElementProcessor = (group, element, context) => {
    const processor =
        tryGetProcessorForEntity(element) ||
        context.elementProcessors[element.tagName] ||
        generalProcessor;
    processor(group, element, context);
};

function tryGetProcessorForEntity(element: HTMLElement): ElementProcessor | null {
    return element.className && getEntityFromElement(element) ? entityProcessor : null;
}
