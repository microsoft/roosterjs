import { isEntityDelimiter, isEntityElement } from '../../domUtils/entityUtils';
import type {
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
    const processor = (tryGetProcessorForCoauthoringMarker(element, context) ||
        tryGetProcessorForEntity(element, context) ||
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

function tryGetProcessorForDelimiter(element: HTMLElement, context: DomToModelContext) {
    return isEntityDelimiter(element) ? context.elementProcessors.delimiter : null;
}

function tryGetProcessorForCoauthoringMarker(element: HTMLElement, context: DomToModelContext) {
    return element.classList.contains('roosterjs-coauthoring-marker')
        ? processCoauthoringMarker
        : null;
}

function processCoauthoringMarker(group: any, element: HTMLElement, context: DomToModelContext) {
    // no op
}
