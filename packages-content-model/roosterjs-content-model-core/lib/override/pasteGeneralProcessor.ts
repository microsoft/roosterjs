import { AllowedTags, DisallowedTags } from '../utils/allowedTags';
import { createSanitizedElement } from '../utils/sanitizeElement';
import { moveChildNodes } from 'roosterjs-content-model-dom';
import type { DomToModelOptionForPaste, ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createPasteGeneralProcessor(
    options: DomToModelOptionForPaste
): ElementProcessor<HTMLElement> {
    const allowedTags = AllowedTags.concat(options.additionalAllowedTags);
    const disallowedTags = DisallowedTags.concat(options.additionalDisallowedTags);

    return (group, element, context) => {
        const tag = element.tagName.toLowerCase();
        const processor =
            allowedTags.indexOf(tag) >= 0
                ? internalGeneralProcessor
                : disallowedTags.indexOf(tag) >= 0
                ? undefined // Ignore those disallowed tags
                : context.elementProcessors.span; // For other unknown tags, treat them as SPAN

        processor?.(group, element, context);
    };
}

const internalGeneralProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const sanitizedElement = createSanitizedElement(
        element.ownerDocument,
        element.tagName,
        element.attributes
    );

    moveChildNodes(sanitizedElement, element);
    context.defaultElementProcessors['*']?.(group, sanitizedElement, context);
};
