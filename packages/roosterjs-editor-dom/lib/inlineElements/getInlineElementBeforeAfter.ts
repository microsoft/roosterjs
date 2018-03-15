import PartialInlineElement from './PartialInlineElement';
import Position from '../selection/Position';
import getInlineElementAtNode from './getInlineElementAtNode';
import shouldSkipNode from '../domWalker/shouldSkipNode';
import { NodeType } from 'roosterjs-editor-types';
import InlineElement from './InlineElement';
import { getPreviousLeafSibling, getNextLeafSibling } from '../domWalker/getLeafSibling';

export { InlineElement };

/**
 * Get inline element before a position
 * This is mostly used when we want to get the inline element before selection/cursor
 * There is a possible that the cursor is in middle of an inline element (i.e. mid of a text node)
 * in this case, we only want to return what is before cursor (a partial of an inline) to indicate
 * that we're in middle.
 * @param rootNode Root node of current scope, use for create InlineElement
 * @param position The position to get InlineElement before
 */
export function getInlineElementBefore(rootNode: Node, position: Position) {
    return getInlineElementBeforeAfterPoint(rootNode, position, false /*isAfter*/);
}

/**
 * Get inline element after a position
 * This is mostly used when we want to get the inline element after selection/cursor
 * There is a possible that the cursor is in middle of an inline element (i.e. mid of a text node)
 * in this case, we only want to return what is before cursor (a partial of an inline) to indicate
 * that we're in middle.
 * @param rootNode Root node of current scope, use for create InlineElement
 * @param position The position to get InlineElement after
 */
export function getInlineElementAfter(rootNode: Node, position: Position) {
    return getInlineElementBeforeAfterPoint(rootNode, position, true /*isAfter*/);
}

function getInlineElementBeforeAfterPoint(rootNode: Node, position: Position, isAfter: boolean) {
    if (!position || !position.node) {
        return null;
    }

    position = position.normalize();
    let node = position.node;
    let isPartial = false;
    let traverseFunc = isAfter ? getNextLeafSibling : getPreviousLeafSibling;
    if (
        (!isAfter && position.offset == 0 && !position.isAtEnd) ||
        (isAfter && position.isAtEnd)
     ) {
        node = traverseFunc(rootNode, node);
    } else if (node.nodeType == NodeType.Text && (
        (!isAfter && !position.isAtEnd) || (isAfter && position.offset > 0))) {
        isPartial = true;
    }

    while (node && shouldSkipNode(node)) {
        node = traverseFunc(rootNode, node);
    }

    let inlineElement = getInlineElementAtNode(node);

    if (inlineElement && (inlineElement.contains(position) || isPartial)) {
        inlineElement = isAfter ?
            new PartialInlineElement(inlineElement, position, null) :
            new PartialInlineElement(inlineElement, null, position);
    }

    return inlineElement;
}
