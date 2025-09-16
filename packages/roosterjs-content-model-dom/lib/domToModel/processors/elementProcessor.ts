import { createSelectionMarker } from '../../modelApi/creators/createSelectionMarker';
import { ensureParagraph } from '../../modelApi/common/ensureParagraph';
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
        ? coauthoringMarkerProcessor
        : null;
}

const coauthoringMarkerProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const owner = element.dataset.owner;

    if (owner && owner != context.owner) {
        const paragraph = ensureParagraph(group, context.blockFormat, context.segmentFormat);
        const marker = createSelectionMarker(context.segmentFormat);

        marker.isSelected = false;
        marker.owner = owner;

        paragraph.segments.push(marker);
    }
};
