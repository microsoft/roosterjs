import { AllowedTags, DisallowedTags } from '../utils/allowedTags';
import { sanitizeElement } from '../utils/sanitizeElement';
import type { DomToModelOptionForPaste, ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export function createPasteEntityProcessor(
    options: DomToModelOptionForPaste
): ElementProcessor<HTMLElement> {
    const allowedTags = AllowedTags.concat(options.additionalAllowedTags);
    const disallowedTags = DisallowedTags.concat(options.additionalDisallowedTags);

    return (group, element, context) => {
        const sanitizedElement = sanitizeElement(element, allowedTags, disallowedTags);

        if (sanitizedElement) {
            context.defaultElementProcessors.entity(group, sanitizedElement, context);
        }
    };
}
