import changeElementTag from '../utils/changeElementTag';
import contains from '../utils/contains';
import ContentTraverser from '../contentTraverser/ContentTraverser';
import createRange from '../selection/createRange';
import findClosestElementAncestor from '../utils/findClosestElementAncestor';
import getBlockElementAtNode from '../blockElements/getBlockElementAtNode';
import getTagOfNode from '../utils/getTagOfNode';
import isNodeEmpty from '../utils/isNodeEmpty';
import isPositionAtBeginningOf from '../selection/isPositionAtBeginningOf';
import isVoidHtmlElement from '../utils/isVoidHtmlElement';
import LinkInlineElement from '../inlineElements/LinkInlineElement';
import moveChildNodes from '../utils/moveChildNodes';
import pasteTable from '../table/pasteTable';
import Position from '../selection/Position';
import PositionContentSearcher from '../contentTraverser/PositionContentSearcher';
import queryElements from '../utils/queryElements';
import splitTextNode from '../utils/splitTextNode';
import toArray from '../jsUtils/toArray';
import unwrap from '../utils/unwrap';
import wrap from '../utils/wrap';
import { splitBalancedNodeRange } from '../utils/splitParentNode';
import {
    BlockElement,
    NodePosition,
    NodeType,
    PositionType,
    QueryScope,
} from 'roosterjs-editor-types';

const NOT_EDITABLE_SELECTOR = '[contenteditable=false]';

const adjustSteps: ((
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition,
    range: Range
) => NodePosition)[] = [
    adjustInsertPositionForHyperLink,
    adjustInsertPositionForStructuredNode,
    adjustInsertPositionForParagraph,
    adjustInsertPositionForVoidElement,
    adjustInsertPositionForMoveCursorOutOfALink,
    adjustInsertPositionForNotEditableNode,
    adjustInsertPositionForTable,
];

/**
 * Adjust position for A tag don't be nested inside another A tag.
 */
function adjustInsertPositionForHyperLink(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition,
    range: Range
): NodePosition {
    let blockElement = getBlockElementAtNode(root, position.node);

    if (blockElement) {
        // Find the first <A> tag within current block which covers current selection
        // If there are more than one nested, let's handle the first one only since that is not a common scenario.
        let anchor: HTMLElement | null = queryElements(
            root,
            'a[href]',
            null /*forEachCallback*/,
            QueryScope.OnSelection,
            createRange(position)
        ).filter((a: HTMLElement) => blockElement!.contains(a))[0];

        // If this is about to insert node to an empty A tag, clear the A tag and reset position
        if (anchor && isNodeEmpty(anchor)) {
            position = new Position(anchor, PositionType.Before);
            safeRemove(anchor);
            anchor = null;
        }

        // If this is about to insert nodes which contains A tag into another A tag, need to break current A tag
        // otherwise we will have nested A tags which is a wrong HTML structure
        if (
            anchor &&
            (<ParentNode>(nodeToInsert as HTMLElement))?.querySelector &&
            (<ParentNode>(nodeToInsert as HTMLElement))?.querySelector('a[href]')
        ) {
            let normalizedPosition = position.normalize();
            let parentNode = normalizedPosition.node.parentNode!;
            let nextNode =
                normalizedPosition.node.nodeType == NodeType.Text
                    ? splitTextNode(
                          <Text>normalizedPosition.node,
                          normalizedPosition.offset,
                          false /*returnFirstPart*/
                      )
                    : normalizedPosition.isAtEnd
                    ? normalizedPosition.node.nextSibling
                    : normalizedPosition.node;
            let splitter: Node | null = root.ownerDocument.createTextNode('');
            parentNode.insertBefore(splitter, nextNode);

            while (splitter && contains(anchor, splitter)) {
                splitter = splitBalancedNodeRange(splitter);
            }

            if (splitter) {
                position = new Position(splitter, PositionType.Before);
                safeRemove(splitter);
            }
        }
    }

    return position;
}

/**
 * Adjust position for a node don't be nested inside tags like BR, LI, TD.
 */
function adjustInsertPositionForStructuredNode(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition,
    range: Range
): NodePosition {
    let rootNodeToInsert: Node | null = nodeToInsert;
    let isFragment: boolean = false;

    if (rootNodeToInsert.nodeType == NodeType.DocumentFragment) {
        isFragment = true;
        let rootNodes = toArray(rootNodeToInsert.childNodes).filter(
            (n: ChildNode) => getTagOfNode(n) != 'BR'
        );
        rootNodeToInsert = rootNodes.length == 1 ? rootNodes[0] : null;
    }

    let tag = getTagOfNode(rootNodeToInsert);
    let hasBrNextToRoot =
        tag && rootNodeToInsert && getTagOfNode(rootNodeToInsert.nextSibling) == 'BR';
    let listItem = findClosestElementAncestor(position.node, root, 'LI');
    let listNode = listItem && findClosestElementAncestor(listItem, root, 'OL,UL');
    let tdNode = findClosestElementAncestor(position.node, root, 'TD,TH');

    if (tag == 'LI') {
        tag = listNode ? getTagOfNode(listNode) : 'UL';
        rootNodeToInsert = wrap(rootNodeToInsert!, tag);
    }

    if (
        (tag == 'OL' || tag == 'UL') &&
        rootNodeToInsert &&
        getTagOfNode(rootNodeToInsert.firstChild) == 'LI'
    ) {
        let shouldInsertListAsText = !rootNodeToInsert.firstChild!.nextSibling && !hasBrNextToRoot;

        if (hasBrNextToRoot && rootNodeToInsert.parentNode) {
            safeRemove(rootNodeToInsert.nextSibling!);
        }

        if (shouldInsertListAsText) {
            unwrap(rootNodeToInsert.firstChild!);
            unwrap(rootNodeToInsert);
        } else if (getTagOfNode(listNode) == tag) {
            unwrap(rootNodeToInsert);
            position = new Position(
                listItem!,
                isPositionAtBeginningOf(position, listItem!)
                    ? PositionType.Before
                    : PositionType.After
            );
        }
    }

    if (isFragment && tag == 'TABLE' && tdNode) {
        pasteTable(
            <HTMLTableCellElement>tdNode,
            <HTMLTableElement>rootNodeToInsert,
            position,
            range
        );
        position = new Position(rootNodeToInsert!, 0);
        moveChildNodes(nodeToInsert);
    }

    return position;
}

/**
 * Change P tag to DIV, when a new node when insert node.
 */

function adjustInsertPositionForParagraph(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition,
    range: Range
): NodePosition {
    if (getTagOfNode(position.node) == 'P') {
        // Insert into a P tag may cause issues when the inserted content contains any block element.
        // Change P tag to DIV to make sure it works well
        let pos = position.normalize();
        let div = changeElementTag(<HTMLElement>position.node, 'div');
        if (pos.node != div) {
            position = pos;
        }
    }

    return position;
}

/**
 * Adjust position for a node that can have children.
 */

function adjustInsertPositionForVoidElement(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition,
    range: Range
): NodePosition {
    if (isVoidHtmlElement(position.node)) {
        position = new Position(
            position.node,
            position.isAtEnd ? PositionType.After : PositionType.Before
        );
    }
    return position;
}

/**
 * Adjust the position cursor out of link when a new node is inserted.
 */

function adjustInsertPositionForMoveCursorOutOfALink(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition,
    range: Range
): NodePosition {
    if (range && range.collapsed) {
        const searcher = new PositionContentSearcher(root, Position.getStart(range));
        const inlineElementBefore = searcher.getInlineElementBefore();
        const inlineElementAfter = searcher.getInlineElementAfter();
        if (inlineElementBefore instanceof LinkInlineElement) {
            position = new Position(inlineElementBefore.getContainerNode(), PositionType.After);
        } else if (inlineElementAfter instanceof LinkInlineElement) {
            position = new Position(inlineElementAfter.getContainerNode(), PositionType.Before);
        }
    }
    return position;
}

/**
 * Adjust the position cursor out of a not contenteditable element.
 */
function adjustInsertPositionForNotEditableNode(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition,
    range: Range
): NodePosition {
    if (!position.element?.isContentEditable) {
        let nonEditableElement: HTMLElement | undefined;
        let lastNonEditableElement: HTMLElement | null = findClosestElementAncestor(
            position.node,
            root,
            NOT_EDITABLE_SELECTOR
        );

        while (lastNonEditableElement) {
            nonEditableElement = lastNonEditableElement;
            lastNonEditableElement = nonEditableElement?.parentElement
                ? findClosestElementAncestor(
                      nonEditableElement.parentElement,
                      root,
                      NOT_EDITABLE_SELECTOR
                  )
                : null;
        }

        if (nonEditableElement) {
            position = new Position(nonEditableElement, PositionType.After);
            return adjustInsertPositionForNotEditableNode(root, nodeToInsert, position, range);
        }
    }

    return position;
}

/**
 * Adjust the position of a table to be one line after another table.
 */
function adjustInsertPositionForTable(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition,
    range: Range
): NodePosition {
    if (
        (nodeToInsert.childNodes.length == 1 &&
            getTagOfNode(nodeToInsert.childNodes[0]) == 'TABLE') ||
        getTagOfNode(nodeToInsert) == 'TABLE'
    ) {
        const { element } = position;

        const posBefore = new Position(element, PositionType.Before);
        const rangeToTraverse = createRange(posBefore, position);
        const contentTraverser = ContentTraverser.createSelectionTraverser(root, rangeToTraverse);

        let blockElement = contentTraverser && contentTraverser.currentBlockElement;

        if (blockElement) {
            let nextBlockElement: BlockElement | null = blockElement;

            while (!nextBlockElement) {
                nextBlockElement = contentTraverser.getNextBlockElement();
                if (nextBlockElement) {
                    blockElement = nextBlockElement;
                }
            }

            const prevElement = blockElement?.getEndNode();

            if (prevElement && findClosestElementAncestor(prevElement, root, 'TABLE')) {
                let tempRange = createRange(position);
                tempRange.collapse(false /* toStart */);
                const br = root.ownerDocument.createElement('br');
                tempRange.insertNode(br);

                tempRange = createRange(br);
                position = Position.getEnd(tempRange);
            }
        }
    }
    return position;
}

/**
 *
 * @param root the contentDiv of the ditor
 * @param nodeToInsert the node to be inserted
 * @param position the position of the node to be inserted
 * @param range the range current or cached range of the editor
 * @returns the adjusted position of the inserted node
 */

export default function adjustInsertPositionBySteps(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition,
    range: Range
): NodePosition {
    adjustSteps.forEach(handler => {
        position = handler(root, nodeToInsert, position, range);
    });
    return position;
}

function safeRemove(node: Node) {
    node?.parentNode?.removeChild(node);
}
