import { AllowedTags, createSanitizedElement, DisallowedTags } from '../utils/sanitizeElement';
import { moveChildNodes } from 'roosterjs-content-model-dom';
import type {
    DomToModelOptionForSanitizing,
    ElementProcessor,
    ValueSanitizer,
} from 'roosterjs-content-model-types';

/**
 * @internal Export for test only
 */
export const removeDisplayFlex: ValueSanitizer = value => {
    return value == 'flex' ? null : value;
};

const DefaultStyleSanitizers: Readonly<Record<string, ValueSanitizer>> = {
    position: false,
    display: removeDisplayFlex,
};

/**
 * @internal
 */
export function createPasteGeneralProcessor(
    options: DomToModelOptionForSanitizing
): ElementProcessor<HTMLElement> {
    const allowedTags = AllowedTags.concat(options.additionalAllowedTags);
    const disallowedTags = DisallowedTags.concat(options.additionalDisallowedTags);
    const styleSanitizers = Object.assign({}, DefaultStyleSanitizers, options.styleSanitizers);
    const attrSanitizers = options.attributeSanitizers;

    return (group, element, context) => {
        const tag = element.tagName.toLowerCase();
        const processor: ElementProcessor<HTMLElement> | undefined =
            allowedTags.indexOf(tag) >= 0
                ? (group, element, context) => {
                      const sanitizedElement = createSanitizedElement(
                          element.ownerDocument,
                          element.tagName,
                          element.attributes,
                          styleSanitizers,
                          attrSanitizers
                      );

                      moveChildNodes(sanitizedElement, element);
                      context.defaultElementProcessors['*']?.(group, sanitizedElement, context);
                  }
                : disallowedTags.indexOf(tag) >= 0
                ? undefined // Ignore those disallowed tags
                : context.defaultElementProcessors.span; // For other unknown tags, treat them as SPAN

        processor?.(group, element, context);
    };
}
