import changeElementTag from './changeElementTag';
import contains from './contains';
import createRange from '../selection/createRange';
import findClosestElementAncestor from './findClosestElementAncestor';
import getBlockElementAtNode from '../blockElements/getBlockElementAtNode';
import getTagOfNode from './getTagOfNode';
import isNodeEmpty from './isNodeEmpty';
import isPositionAtBeginningOf from '../selection/isPositionAtBeginningOf';
import isVoidHtmlElement from './isVoidHtmlElement';
import Position from '../selection/Position';
import queryElements from './queryElements';
import splitTextNode from './splitTextNode';
import unwrap from './unwrap';
import VTable from '../table/VTable';
import wrap from './wrap';
import { NodePosition, NodeType, PositionType, QueryScope } from 'roosterjs-editor-types';
import { splitBalancedNodeRange } from './splitParentNode';

const adjustSteps: ((
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition
) => NodePosition)[] = [handleHyperLink, handleStructuredNode, handleParagraph, handleVoidElement];

/**
 * Adjust the given position and return a better position (if any) or the given position
 * which will be the best one for inserting the given node.
 * @param root Root node of the scope
 * @param nodeToInsert The node about to be inserted
 * @param position The original position to insert the node
 */
export default function adjustNodeInsertPosition(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition
): NodePosition {
    adjustSteps.forEach(handler => {
        position = handler(root, nodeToInsert, position);
    });

    return position;
}

function handleHyperLink(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition
): NodePosition {
    let blockElement = getBlockElementAtNode(root, position.node);

    if (blockElement) {
        // Find the first <A> tag within current block which covers current selection
        // If there are more than one nested, let's handle the first one only since that is not a common scenario.
        let anchor = queryElements(
            root,
            'a[href]',
            null /*forEachCallback*/,
            QueryScope.OnSelection,
            createRange(position)
        ).filter(a => blockElement.contains(a))[0];

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
            (<ParentNode>(<any>nodeToInsert)).querySelector &&
            (<ParentNode>(<any>nodeToInsert)).querySelector('a[href]')
        ) {
            let normalizedPosition = position.normalize();
            let parentNode = normalizedPosition.node.parentNode;
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
            let splitter: Node = root.ownerDocument.createTextNode('');
            parentNode.insertBefore(splitter, nextNode);

            while (contains(anchor, splitter)) {
                splitter = splitBalancedNodeRange(splitter);
            }

            position = new Position(splitter, PositionType.Before);
            safeRemove(splitter);
        }
    }

    return position;
}

function handleStructuredNode(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition
): NodePosition {
    let rootNodeToInsert = nodeToInsert;

    if (rootNodeToInsert.nodeType == NodeType.DocumentFragment) {
        let rootNodes = (<Node[]>[].slice.call(rootNodeToInsert.childNodes)).filter(
            n => getTagOfNode(n) != 'BR'
        );
        rootNodeToInsert = rootNodes.length == 1 ? rootNodes[0] : null;
    }

    let tag = getTagOfNode(rootNodeToInsert);
    let hasBrNextToRoot = tag && getTagOfNode(rootNodeToInsert.nextSibling) == 'BR';
    let listItem = findClosestElementAncestor(position.node, root, 'LI');
    let listNode = listItem && findClosestElementAncestor(listItem, root, 'OL,UL');
    let tdNode = findClosestElementAncestor(position.node, root, 'TD,TH');
    let trNode = tdNode && findClosestElementAncestor(tdNode, root, 'TR');

    if (tag == 'LI') {
        tag = listNode ? getTagOfNode(listNode) : 'UL';
        rootNodeToInsert = wrap(rootNodeToInsert, tag);
    }

    if ((tag == 'OL' || tag == 'UL') && getTagOfNode(rootNodeToInsert.firstChild) == 'LI') {
        let shouldInsertListAsText = !rootNodeToInsert.firstChild.nextSibling && !hasBrNextToRoot;

        if (hasBrNextToRoot && rootNodeToInsert.parentNode) {
            safeRemove(rootNodeToInsert.nextSibling);
        }

        if (shouldInsertListAsText) {
            unwrap(rootNodeToInsert.firstChild);
            unwrap(rootNodeToInsert);
        } else if (getTagOfNode(listNode) == tag) {
            unwrap(rootNodeToInsert);
            position = new Position(
                listItem,
                isPositionAtBeginningOf(position, listItem)
                    ? PositionType.Before
                    : PositionType.After
            );
        }
    } else if (tag == 'TABLE' && trNode) {
        // When inserting a table into a table, if these tables have the same column count, and
        // current position is at beginning of a row, then merge these two tables
        let newTable = new VTable(<HTMLTableElement>rootNodeToInsert);
        let currentTable = new VTable(<HTMLTableCellElement>tdNode);
        if (
            currentTable.col == 0 &&
            tdNode == currentTable.getCell(currentTable.row, 0).td &&
            newTable.cells[0] &&
            newTable.cells[0].length == currentTable.cells[0].length &&
            isPositionAtBeginningOf(position, tdNode)
        ) {
            if (
                getTagOfNode(rootNodeToInsert.firstChild) == 'TBODY' &&
                !rootNodeToInsert.firstChild.nextSibling
            ) {
                unwrap(rootNodeToInsert.firstChild);
            }
            unwrap(rootNodeToInsert);
            position = new Position(trNode, PositionType.After);
        }
    }

    return position;
}

function handleParagraph(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition
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

function handleVoidElement(
    root: HTMLElement,
    nodeToInsert: Node,
    position: NodePosition
): NodePosition {
    if (isVoidHtmlElement(position.node)) {
        position = new Position(
            position.node,
            position.isAtEnd ? PositionType.After : PositionType.Before
        );
    }

    return position;
}

function safeRemove(node: Node) {
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
}
