import { DomToModelContext } from '../../publicTypes/context/DomToModelContext';
import { ElementProcessor } from '../../publicTypes/context/ElementProcessor';
import { ElementProcessorMap } from '../../publicTypes/context/DomToModelSettings';
import { getEntityFromElement } from 'roosterjs-editor-dom';

/**
 * @internal
 * @param group
 * @param element
 * @param context
 */
export const elementProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const tagName = element.tagName.toLowerCase() as keyof ElementProcessorMap;
    const processor = (tryGetProcessorForEntity(element, context) ||
        context.elementProcessors[tagName] ||
        (tagName.indexOf(':') >= 0 && context.elementProcessors.child) ||
        context.elementProcessors['*']) as ElementProcessor<Node>;
    processor(group, element, context);
};

function tryGetProcessorForEntity(element: HTMLElement, context: DomToModelContext) {
    return (element.className && getEntityFromElement(element)) ||
        element.contentEditable == 'false' // For readonly element, treat as an entity
        ? context.elementProcessors.entity
        : null;
}
