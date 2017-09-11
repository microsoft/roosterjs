import PartialInlineElement from '../inlineElements/PartialInlineElement';
import TextInlineElement from '../inlineElements/TextInlineElement';
import { InlineElement } from 'roosterjs-types';

// Check if the inline is a text type inline element
// This essentially test if the inline is TextInlineElement
// or a partial inline element that decorates a TextInlineElement
export default function isTextualInlineElement(inlineElement: InlineElement): boolean {
    let isTextualInlineElement = false;
    if (inlineElement) {
        isTextualInlineElement =
            inlineElement instanceof TextInlineElement ||
            (inlineElement instanceof PartialInlineElement &&
                (inlineElement as PartialInlineElement).getDecoratedInline() instanceof
                    TextInlineElement);
    }
    return isTextualInlineElement;
}
