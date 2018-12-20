import getInlineElementAtNode from './getInlineElementAtNode';
import PartialInlineElement from './PartialInlineElement';
import { getLeafSibling } from '../utils/getLeafSibling';
import { InlineElement } from 'roosterjs-editor-types';

export default function getNextPreviousInlineElement(
    rootNode: Node,
    current: InlineElement,
    isNext: boolean
): InlineElement {
    if (!current) {
        return null;
    }
    if (current instanceof PartialInlineElement) {
        // if current is partial, get the the othe half of the inline unless it is no more
        let result = isNext ? current.nextInlineElement : current.previousInlineElement;

        if (result) {
            return result;
        }
    }

    // Get a leaf node after startNode and use that base to find next inline
    let startNode = current.getContainerNode();
    startNode = getLeafSibling(rootNode, startNode, isNext);
    return getInlineElementAtNode(rootNode, startNode);
}
