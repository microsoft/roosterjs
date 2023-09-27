import { getDelimiterFromElement } from 'roosterjs-editor-dom';
import { isEntityElement } from '../../domUtils/entityUtils';
import {
    DomToModelContext,
    ElementProcessor,
    ElementProcessorMap,
} from 'roosterjs-content-model-types';

/**
 * @internal
 * @param group
 * @param element
 * @param context
 */
export const elementProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const tagName = element.tagName.toLowerCase() as keyof ElementProcessorMap;
    const processor = (tryGetProcessorForEntity(element, context) ||
        tryGetProcessorForDelimiter(element, context) ||
        context.elementProcessors[tagName] ||
        (tagName.indexOf(':') >= 0 && context.elementProcessors.child) ||
        context.elementProcessors['*']) as ElementProcessor<Node>;
    processor(group, element, context);
};

function tryGetProcessorForEntity(element: HTMLElement, context: DomToModelContext) {
    return isEntityElement(element) || element.contentEditable == 'false' // For readonly element, treat as an entity
        ? context.elementProcessors.entity
        : null;
}

function tryGetProcessorForDelimiter(element: Node, context: DomToModelContext) {
    return getDelimiterFromElement(element) ? context.elementProcessors.delimiter : null;
}
