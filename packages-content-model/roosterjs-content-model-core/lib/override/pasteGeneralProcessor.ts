import { AllowedTags, DisallowedTags } from '../utils/allowedTags';
import { getSanitizedElement } from '../utils/getSanitizeElement';
import { moveChildNodes } from 'roosterjs-content-model-dom';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const pasteGeneralProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const tag = element.tagName.toLowerCase();
    const processor =
        AllowedTags.indexOf(tag) >= 0
            ? internalGeneralProcessor
            : DisallowedTags.indexOf(tag) >= 0
            ? undefined // Ignore those disallowed tags
            : context.elementProcessors.span; // For other unknown tags, treat them as SPAN

    processor?.(group, element, context);
};

const internalGeneralProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const sanitizedElement = getSanitizedElement(
        element.ownerDocument,
        element.tagName,
        element.attributes
    );

    moveChildNodes(sanitizedElement, element);
    context.defaultElementProcessors['*']?.(group, sanitizedElement, context);
};
