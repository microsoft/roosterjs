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
        context.elementProcessors['*']) as ElementProcessor<Node>;
    processor(group, element, context);
};

function tryGetProcessorForEntity(element: HTMLElement, context: DomToModelContext) {
    return element.className && getEntityFromElement(element)
        ? context.elementProcessors.entity
        : null;
}
