import createElement from '../utils/createElement';
import getRootListNode from './getRootListNode';
import getSelectedBlockElementsInRegion from '../region/getSelectedBlockElementsInRegion';
import isNodeInRegion from '../region/isNodeInRegion';
import Position from '../selection/Position';
import safeInstanceOf from '../utils/safeInstanceOf';
import shouldSkipNode from '../utils/shouldSkipNode';
import toArray from '../jsUtils/toArray';
import VList from './VList';
import wrap from '../utils/wrap';
import { getLeafSibling } from '../utils/getLeafSibling';
import { isListElement } from './getListTypeFromNode';
import {
    KnownCreateElementDataIndex,
    ListType,
    Region,
    PositionType,
} from 'roosterjs-editor-types';

const ListSelector = 'ol,ul';

/**
 * Create a VList object from the given region.
 * @param region The region to get VList from
 * @param includeSiblingLists True to also try get lists before and after the selection and merge them together,
 * false to only include the list for the selected blocks
 * @param startNode (Optional) When specified, try get VList which will contain this node.
 * If not specified, get VList from selection of this region
 */
export default function createVListFromRegion(
    region: Region,
    includeSiblingLists?: boolean,
    startNode?: Node
): VList | null {
    if (!region) {
        return null;
    }

    let nodes: Node[] = [];

    if (startNode) {
        const list = getRootListNode(region, ListSelector, startNode);
        if (list) {
            nodes.push(list);
        }
    } else {
        const blocks = getSelectedBlockElementsInRegion(
            region,
            undefined,
            true /* shouldApplyFormatToSpan */
        );
        blocks.forEach(block => {
            const list = getRootListNode(region, ListSelector, block.getStartNode());

            if (list) {
                if (nodes[nodes.length - 1] != list) {
                    nodes.push(list);
                }
                if (
                    nodes.length == 1 &&
                    safeInstanceOf(list, 'HTMLOListElement') &&
                    list.start > 1
                ) {
                    // Do not include sibling lists if this list is not start from 1
                    includeSiblingLists = false;
                }
            } else {
                nodes.push(block.collapseToSingleElement());
            }
        });

        if (nodes.length == 0 && !region.rootNode.firstChild) {
            const newNode = createElement(
                KnownCreateElementDataIndex.EmptyLine,
                region.rootNode.ownerDocument
            )!;
            region.rootNode.appendChild(newNode);
            nodes.push(newNode);
            region.fullSelectionStart = new Position(newNode, PositionType.Begin);
            region.fullSelectionEnd = new Position(newNode, PositionType.End);
        }

        if (includeSiblingLists) {
            tryIncludeSiblingNode(region, nodes, false /*isNext*/);
            tryIncludeSiblingNode(region, nodes, true /*isNext*/);
        }

        nodes = nodes.filter(node => !shouldSkipNode(node, true /*ignoreSpace*/));
    }

    let vList: VList | null = null;

    if (nodes.length > 0) {
        const firstNode = nodes.shift() || null;
        vList = isListElement(firstNode)
            ? new VList(firstNode)
            : firstNode
            ? createVListFromItemNode(firstNode)
            : null;

        if (vList) {
            nodes.forEach(node => {
                if (isListElement(node)) {
                    vList!.mergeVList(new VList(node));
                } else {
                    vList!.appendItem(node, ListType.None);
                }
            });
        }
    }

    return vList;
}

function tryIncludeSiblingNode(region: Region, nodes: Node[], isNext: boolean) {
    let node: Node | null = nodes[isNext ? nodes.length - 1 : 0];
    node = getLeafSibling(region.rootNode, node, isNext, region.skipTags, true /*ignoreSpace*/);
    node = getRootListNode(region, ListSelector, node);
    if (isNodeInRegion(region, node) && isListElement(node)) {
        if (isNext) {
            if (!safeInstanceOf(node, 'HTMLOListElement') || node.start == 1) {
                // Only include sibling list when
                // 1. This is a unordered list, OR
                // 2. This list starts from 1
                nodes.push(node);
            }
        } else {
            nodes.unshift(node);
        }
    }
}

function createVListFromItemNode(node: Node): VList {
    // Wrap all child nodes under a single one, and put the new list under original root node
    // so that the list can carry over styles under the root node.
    const childNodes = toArray(node.childNodes);
    const nodeForItem = childNodes.length == 1 ? childNodes[0] : wrap(childNodes, 'SPAN');

    // Create a temporary OL root element for this list.
    const listNode = node.ownerDocument!.createElement('ol'); // Either OL or UL is ok here
    node.appendChild(listNode);

    // Create the VList and append items
    const vList = new VList(listNode);
    vList.appendItem(nodeForItem, ListType.None);

    return vList;
}
