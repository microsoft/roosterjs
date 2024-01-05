import { AllowedTags, DisallowedTags, sanitizeElement } from '../utils/sanitizeElement';
import type {
    DomToModelOptionForPaste,
    ElementProcessor,
    ValueSanitizer,
} from 'roosterjs-content-model-types';

const DefaultStyleSanitizers: Readonly<Record<string, ValueSanitizer>> = {
    position: false,
};

/**
 * @internal
 */
export function createPasteEntityProcessor(
    options: DomToModelOptionForPaste
): ElementProcessor<HTMLElement> {
    const allowedTags = AllowedTags.concat(options.additionalAllowedTags);
    const disallowedTags = DisallowedTags.concat(options.additionalDisallowedTags);
    const styleSanitizers = Object.assign({}, DefaultStyleSanitizers, options.styleSanitizers);
    const attrSanitizers = options.attributeSanitizers;

    return (group, element, context) => {
        const sanitizedElement = sanitizeElement(
            element,
            allowedTags,
            disallowedTags,
            styleSanitizers,
            attrSanitizers
        );

        if (sanitizedElement) {
            context.defaultElementProcessors.entity(group, sanitizedElement, context);
        }
    };
}
