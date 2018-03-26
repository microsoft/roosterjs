import InlineElement from './InlineElement';
import PartialInlineElement from './PartialInlineElement';
import getInlineElementAtNode from './getInlineElementAtNode';
import { getLeafSibling } from '../domWalker/getLeafSibling';

/**
 * Get next inline element
 */
export function getNextInlineElement(rootNode: Node, inlineElement: InlineElement): InlineElement {
    let end = inlineElement.getEndPosition();
    return end.isAtEnd
        ? getInlineElementAtNode(
              getLeafSibling(rootNode, inlineElement.getContainerNode(), true /*isNext*/)
          )
        : new PartialInlineElement(inlineElement, end, null);
}

/**
 * Get previous inline element
 */
export function getPreviousInlineElement(
    rootNode: Node,
    inlineElement: InlineElement
): InlineElement {
    let start = inlineElement.getStartPosition();
    return start.offset == 0
        ? getInlineElementAtNode(
              getLeafSibling(rootNode, inlineElement.getContainerNode(), false /*isNext*/)
          )
        : new PartialInlineElement(inlineElement, null, start);
}
