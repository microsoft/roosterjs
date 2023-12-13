import { AllowedTags, DisallowedTags } from '../utils/allowedTags';
import { getSanitizedElement } from '../utils/getSanitizeElement';
import { isNodeOfType } from 'roosterjs-content-model-dom';
import type { ElementProcessor } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const pasteEntityProcessor: ElementProcessor<HTMLElement> = (group, element, context) => {
    const sanitizedElement = sanitizeElementTree(element);

    if (sanitizedElement) {
        context.defaultElementProcessors.entity(group, sanitizedElement, context);
    }
};

function sanitizeElementTree(element: HTMLElement) {
    const tag = element.tagName.toLowerCase();
    const sanitizedElement =
        DisallowedTags.indexOf(tag) >= 0
            ? null
            : getSanitizedElement(
                  element.ownerDocument,
                  AllowedTags.indexOf(tag) >= 0 ? tag : 'span',
                  element.attributes
              );

    for (let child = sanitizedElement?.firstChild; child; child = child.nextSibling) {
        const newChild = isNodeOfType(child, 'ELEMENT_NODE')
            ? sanitizeElementTree(child)
            : isNodeOfType(child, 'TEXT_NODE')
            ? child
            : null;

        if (newChild) {
            sanitizedElement?.appendChild(newChild);
        }
    }

    return sanitizedElement;
}
