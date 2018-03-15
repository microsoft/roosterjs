import InlineElement from './InlineElement';
import PartialInlineElement from './PartialInlineElement';
import getInlineElementAtNode from './getInlineElementAtNode';
import { getLeafSibling } from '../domWalker/getLeafSibling';

/**
 * Get next inline element
 */
export function getNextInlineElement(rootNode: Node, inlineElement: InlineElement): InlineElement {
    return getNextPreviousInlineElement(rootNode, inlineElement, true /*isNext*/);
}

/**
 * Get previous inline element
 */
export function getPreviousInlineElement(rootNode: Node, inlineElement: InlineElement): InlineElement {
    return getNextPreviousInlineElement(rootNode, inlineElement, false /*isNext*/);
}

function getNextPreviousInlineElement(
    rootNode: Node,
    inlineElement: InlineElement,
    isNext: boolean
): InlineElement {
    return (inlineElement instanceof PartialInlineElement && (isNext ? inlineElement.nextInlineElement : inlineElement.previousInlineElement)) ||
    getInlineElementAtNode(getLeafSibling(rootNode, inlineElement.getContainerNode(), isNext));
}
