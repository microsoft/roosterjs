import changeElementTag from './changeElementTag';
import findClosestElementAncestor from './findClosestElementAncestor';
import getTagOfNode from './getTagOfNode';
import isPositionAtBeginningOf from '../selection/isPositionAtBeginningOf';
import isVoidHtmlElement from './isVoidHtmlElement';
import Position from '../selection/Position';
import unwrap from './unwrap';
import VTable from '../table/VTable';
import wrap from './wrap';
import { NodePosition, NodeType, PositionType } from 'roosterjs-editor-types';

export default function mergeNode(
    root: Node,
    nodeToInsert: Node,
    positionToInsert: NodePosition
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
    let listItem = findClosestElementAncestor(positionToInsert.node, root, 'LI');
    let listNode = listItem && findClosestElementAncestor(listItem, root, 'OL,UL');
    let tdNode = findClosestElementAncestor(positionToInsert.node, root, 'TD,TH');
    let trNode = tdNode && findClosestElementAncestor(tdNode, root, 'TR');

    if (tag == 'LI') {
        tag = listNode ? getTagOfNode(listNode) : 'UL';
        rootNodeToInsert = wrap(rootNodeToInsert, tag);
    }

    if ((tag == 'OL' || tag == 'UL') && getTagOfNode(rootNodeToInsert.firstChild) == 'LI') {
        let shouldInsertListAsText = !rootNodeToInsert.firstChild.nextSibling && !hasBrNextToRoot;

        if (hasBrNextToRoot && rootNodeToInsert.parentNode) {
            rootNodeToInsert.parentNode.removeChild(rootNodeToInsert.nextSibling);
        }

        if (shouldInsertListAsText) {
            unwrap(rootNodeToInsert.firstChild);
            unwrap(rootNodeToInsert);
        } else if (getTagOfNode(listNode) == tag) {
            unwrap(rootNodeToInsert);
            positionToInsert = new Position(
                listItem,
                isPositionAtBeginningOf(positionToInsert, listItem)
                    ? PositionType.Before
                    : PositionType.After
            );
        }
    } else if (tag == 'TABLE' && trNode) {
        let newTable = new VTable(<HTMLTableElement>rootNodeToInsert);
        let currentTable = new VTable(<HTMLTableCellElement>tdNode);
        if (
            currentTable.col == 0 &&
            tdNode == currentTable.getCell(currentTable.row, 0).td &&
            newTable.cells[0] &&
            newTable.cells[0].length == currentTable.cells[0].length &&
            isPositionAtBeginningOf(positionToInsert, tdNode)
        ) {
            if (
                getTagOfNode(rootNodeToInsert.firstChild) == 'TBODY' &&
                !rootNodeToInsert.firstChild.nextSibling
            ) {
                unwrap(rootNodeToInsert.firstChild);
            }
            unwrap(rootNodeToInsert);
            positionToInsert = new Position(trNode, PositionType.After);
        }
    }

    if (getTagOfNode(positionToInsert.node) == 'P') {
        // Insert into a P tag may cause issues when the inserted content contains any block element.
        // Change P tag to DIV to make sure it works well
        let pos = positionToInsert.normalize();
        let div = changeElementTag(<HTMLElement>positionToInsert.node, 'div');
        if (pos.node != div) {
            positionToInsert = pos;
        }
    }

    if (isVoidHtmlElement(positionToInsert.node)) {
        positionToInsert = new Position(positionToInsert.node, PositionType.After);
    }

    return positionToInsert;
}
