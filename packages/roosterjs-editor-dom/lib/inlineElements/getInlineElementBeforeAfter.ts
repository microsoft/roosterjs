import PartialInlineElement from './PartialInlineElement';
import Position from '../selection/Position';
import shouldSkipNode from '../domWalker/shouldSkipNode';
import { getInlineElementAtNode } from '../blockElements/BlockElement';
import { getLeafSibling } from '../domWalker/getLeafSibling';
import { NodeType, InlineElement } from 'roosterjs-editor-types';

/**
 * Get inline element before a position
 * This is mostly used when we want to get the inline element before selection/cursor
 * There is a possible that the cursor is in middle of an inline element (i.e. mid of a text node)
 * in this case, we only want to return what is before cursor (a partial of an inline) to indicate
 * that we're in middle.
 * @param root Root node of current scope, use for create InlineElement
 * @param position The position to get InlineElement before
 */
export function getInlineElementBefore(root: Node, position: Position): InlineElement {
    return getInlineElementBeforeAfterPosition(root, position, false /*isAfter*/);
}

/**
 * Get inline element after a position
 * This is mostly used when we want to get the inline element after selection/cursor
 * There is a possible that the cursor is in middle of an inline element (i.e. mid of a text node)
 * in this case, we only want to return what is before cursor (a partial of an inline) to indicate
 * that we're in middle.
 * @param root Root node of current scope, use for create InlineElement
 * @param position The position to get InlineElement after
 */
export function getInlineElementAfter(root: Node, position: Position): InlineElement {
    return getInlineElementBeforeAfterPosition(root, position, true /*isAfter*/);
}

function getInlineElementBeforeAfterPosition(root: Node, position: Position, isAfter: boolean) {
    if (!root || !position || !position.node) {
        return null;
    }

    position = position.normalize();
    let { node, offset, isAtEnd } = position;
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
    let editorPoint = position.toEditorPoint();

    if (inlineElement && (isPartial || inlineElement.contains(editorPoint))) {
        inlineElement = isAfter
            ? new PartialInlineElement(inlineElement, editorPoint, null)
            : new PartialInlineElement(inlineElement, null, editorPoint);
    }

    return inlineElement;
}
