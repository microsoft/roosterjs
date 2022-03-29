import getInlineElementAtNode from './getInlineElementAtNode';
import PartialInlineElement from './PartialInlineElement';
import shouldSkipNode from '../utils/shouldSkipNode';
import { getLeafSibling } from '../utils/getLeafSibling';
import { InlineElement, NodePosition, NodeType } from 'roosterjs-editor-types';

/**
 * @internal
 * Get inline element before a position
 * This is mostly used when we want to get the inline element before selection/cursor
 * There is a possible that the cursor is in middle of an inline element (i.e. mid of a text node)
 * in this case, we only want to return what is before cursor (a partial of an inline) to indicate
 * that we're in middle.
 * @param root Root node of current scope, use for create InlineElement
 * @param position The position to get InlineElement before
 */
export function getInlineElementBefore(root: Node, position: NodePosition): InlineElement | null {
    return getInlineElementBeforeAfter(root, position, false /*isAfter*/);
}

/**
 * @internal
 * Get inline element after a position
 * This is mostly used when we want to get the inline element after selection/cursor
 * There is a possible that the cursor is in middle of an inline element (i.e. mid of a text node)
 * in this case, we only want to return what is before cursor (a partial of an inline) to indicate
 * that we're in middle.
 * @param root Root node of current scope, use for create InlineElement
 * @param position The position to get InlineElement after
 */
export function getInlineElementAfter(root: Node, position: NodePosition): InlineElement | null {
    return getInlineElementBeforeAfter(root, position, true /*isAfter*/);
}

/**
 * @internal
 */
export function getInlineElementBeforeAfter(root: Node, position: NodePosition, isAfter: boolean) {
    if (!root || !position || !position.node) {
        return null;
    }

    position = position.normalize();
    let { offset, isAtEnd } = position;
    let node: Node | null = position.node;
    let isPartial = false;

    if ((!isAfter && offset == 0 && !isAtEnd) || (isAfter && isAtEnd)) {
        node = getLeafSibling(root, node, isAfter);
    } else if (
        node.nodeType == NodeType.Text &&
        ((!isAfter && !isAtEnd) || (isAfter && offset > 0))
    ) {
        isPartial = true;
    }

    if (node && shouldSkipNode(node)) {
        node = getLeafSibling(root, node, isAfter);
    }

    let inlineElement = getInlineElementAtNode(root, node);

    if (inlineElement && (isPartial || inlineElement.contains(position))) {
        inlineElement = isAfter
            ? new PartialInlineElement(inlineElement, position, undefined)
            : new PartialInlineElement(inlineElement, undefined, position);
    }

    return inlineElement;
}
