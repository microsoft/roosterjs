import { InlineElement } from 'roosterjs-editor-types';

/**
 * @deprecated Use inlineElement.isTextualInlineElement() instead
 */
export default function isTextualInlineElement(inlineElement: InlineElement): boolean {
    return inlineElement && inlineElement.isTextualInlineElement();
}
