import InlineElementFactory from '../inlineElements/InlineElementFactory';
import PartialInlineElement from '../inlineElements/PartialInlineElement';
import shouldSkipNode from './shouldSkipNode';
import { EditorPoint, InlineElement, NodeBoundary, NodeType } from 'roosterjs-types';
import { getBlockElementAtNode } from './getBlockElement';
import { getFirstLeafNode, getLastLeafNode } from './getLeafNode';
import { getLeafSibling, getPreviousLeafSibling, getNextLeafSibling } from './getLeafSibling';

// Get the inline element at a node
export function getInlineElementAtNode(
    rootNode: Node,
    node: Node,
    inlineElementFactory: InlineElementFactory
): InlineElement {
    // An inline element has to be in a block element, get the block first and then resolve through the factory
    let parentBlock = node ? getBlockElementAtNode(rootNode, node, inlineElementFactory) : null;
    return parentBlock ? inlineElementFactory.resolve(node, rootNode, parentBlock) : null;
}

// Get first inline element
export function getFirstInlineElement(
    rootNode: Node,
    inlineElementFactory: InlineElementFactory
): InlineElement {
    // getFirstLeafNode can return null for empty container
    // do check null before passing on to get inline from the node
    let node = getFirstLeafNode(rootNode);
    return node ? getInlineElementAtNode(rootNode, node, inlineElementFactory) : null;
}

// Get last inline element
export function getLastInlineElement(
    rootNode: Node,
    inlineElementFactory: InlineElementFactory
): InlineElement {
    // getLastLeafNode can return null for empty container
    // do check null before passing on to get inline from the node
    let node = getLastLeafNode(rootNode);
    return node ? getInlineElementAtNode(rootNode, node, inlineElementFactory) : null;
}

function getNextPreviousInlineElement(
    rootNode: Node,
    inlineElement: InlineElement,
    inlineElementFactory: InlineElementFactory,
    isNext: boolean
): InlineElement {
    let result: InlineElement;
    if (inlineElement) {
        if (
            inlineElement instanceof PartialInlineElement &&
            (inlineElement as PartialInlineElement).nextInlineElement
        ) {
            // if current is partial, get the the other half of the inline unless it is no more
            result = (inlineElement as PartialInlineElement).nextInlineElement;
        } else {
            // Get a leaf node after startNode and use that base to find next inline
            let startNode = inlineElement.getContainerNode();
            startNode = getLeafSibling(rootNode, startNode, isNext);
            result = startNode
                ? getInlineElementAtNode(rootNode, startNode, inlineElementFactory)
                : null;
        }
    }

    return result;
}

// Get next inline element
export function getNextInlineElement(
    rootNode: Node,
    inlineElement: InlineElement,
    inlineElementFactory: InlineElementFactory
): InlineElement {
    return getNextPreviousInlineElement(
        rootNode,
        inlineElement,
        inlineElementFactory,
        true /*isNext*/
    );
}

// Get previous inline element
export function getPreviousInlineElement(
    rootNode: Node,
    inlineElement: InlineElement,
    inlineElementFactory: InlineElementFactory
): InlineElement {
    return getNextPreviousInlineElement(
        rootNode,
        inlineElement,
        inlineElementFactory,
        false /*isNext*/
    );
}

// Get inline element before an editor point
// This is mostly used when users want to get the inline element before selection/cursor
// There is a good possibility that the cursor is in middle of an inline element (i.e. mid of a text node)
// in this case, we only want to return what is before cursor (a partial of an inline) to indicate
// that we're in middle. The logic is largely to detect if the editor point runs across an inline element
export function getInlineElementBeforePoint(
    rootNode: Node,
    position: EditorPoint,
    inlineElementFactory: InlineElementFactory
) {
    let inlineElement: InlineElement;
    let containerNode = position.containerNode;
    let offset = position.offset;
    if (containerNode) {
        let isPartial = false;
        if (offset == NodeBoundary.Begin) {
            // The point is at the begin of container element
            containerNode = getPreviousLeafSibling(rootNode, containerNode);
        } else if (
            containerNode.nodeType == NodeType.Text &&
            offset < containerNode.nodeValue.length
        ) {
            // Run across a text node
            isPartial = true;
        }

        if (containerNode && shouldSkipNode(containerNode)) {
            containerNode = getPreviousLeafSibling(rootNode, containerNode);
        }

        inlineElement = containerNode
            ? getInlineElementAtNode(rootNode, containerNode, inlineElementFactory)
            : null;

        // if the inline element we get in the end wraps around the point (contains), this has to be a partial
        isPartial = isPartial || (inlineElement && inlineElement.contains(position));
        if (isPartial && inlineElement) {
            inlineElement = new PartialInlineElement(inlineElement, null, position);
        }
    }

    return inlineElement;
}

// Similar to getInlineElementBeforePoint, to get inline element after an editor point
export function getInlineElementAfterPoint(
    rootNode: Node,
    editorPoint: EditorPoint,
    inlineElementFactory: InlineElementFactory
) {
    let inlineElement: InlineElement;
    let containerNode = editorPoint.containerNode;
    let offset = editorPoint.offset;
    if (containerNode) {
        let isPartial = false;
        if (
            (containerNode.nodeType == NodeType.Text && offset == containerNode.nodeValue.length) ||
            (containerNode.nodeType == NodeType.Element && offset == NodeBoundary.End)
        ) {
            // The point is at the end of container element
            containerNode = getNextLeafSibling(rootNode, containerNode);
        } else if (
            containerNode.nodeType == NodeType.Text &&
            offset > NodeBoundary.Begin &&
            offset < containerNode.nodeValue.length
        ) {
            // Run across a text node, this inline has to be partial
            isPartial = true;
        }

        if (containerNode && shouldSkipNode(containerNode)) {
            containerNode = getNextLeafSibling(rootNode, containerNode);
        }

        inlineElement = containerNode
            ? getInlineElementAtNode(rootNode, containerNode, inlineElementFactory)
            : null;

        // if the inline element we get in the end wraps (contains) the editor point, this has to be a partial
        // the point runs across a test node in a link
        isPartial = isPartial || (inlineElement && inlineElement.contains(editorPoint));

        if (isPartial && inlineElement) {
            inlineElement = new PartialInlineElement(inlineElement, editorPoint, null);
        }
    }

    return inlineElement;
}
