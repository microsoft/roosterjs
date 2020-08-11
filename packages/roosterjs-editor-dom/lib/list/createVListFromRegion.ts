import findClosestElementAncestor from '../utils/findClosestElementAncestor';
import getSelectedBlockElementsInRegion from '../region/getSelectedBlockElementsInRegion';
import isNodeInRegion from '../region/isNodeInRegion';
import shouldSkipNode from '../utils/shouldSkipNode';
import VList from './VList';
import { getLeafSibling } from '../utils/getLeafSibling';
import { isListElement } from './getListTypeFromNode';
import { ListType, Region } from 'roosterjs-editor-types';

type ListElement = HTMLOListElement | HTMLUListElement;
const ListSelector = 'ol,ul';

/**
 * @internal
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
): VList {
    if (!region) {
        return null;
    }

    let nodes: Node[] = [];

    if (startNode) {
        const list = getRootListNode(region, startNode);
        if (list) {
            nodes.push(list);
        }
    } else {
        const blocks = getSelectedBlockElementsInRegion(region);
        blocks.forEach(block => {
            const list = getRootListNode(region, block.getStartNode());

            if (list) {
                if (nodes[nodes.length - 1] != list) {
                    nodes.push(list);
                }
            } else {
                nodes.push(block.collapseToSingleElement());
            }
        });

        if (includeSiblingLists) {
            tryIncludeSiblingNode(region, nodes, false /*isNext*/);
            tryIncludeSiblingNode(region, nodes, true /*isNext*/);
        }

        nodes = nodes.filter(node => !shouldSkipNode(node, true /*ignoreSpace*/));
    }

    let vList: VList = null;

    if (nodes.length > 0) {
        const firstNode = nodes.shift();
        vList = isListElement(firstNode)
            ? new VList(firstNode)
            : createVListFromItemNode(firstNode);

        nodes.forEach(node => {
            if (isListElement(node)) {
                vList.mergeVList(new VList(node));
            } else {
                vList.appendItem(node, ListType.None);
            }
        });
    }

    return vList;
}

function tryIncludeSiblingNode(region: Region, nodes: Node[], isNext: boolean) {
    let node = nodes[isNext ? nodes.length - 1 : 0];
    node = getLeafSibling(region.rootNode, node, isNext, region.skipTags, true /*ignoreSpace*/);
    node = getRootListNode(region, node);
    if (isNodeInRegion(region, node) && isListElement(node)) {
        if (isNext) {
            nodes.push(node);
        } else {
            nodes.unshift(node);
        }
    }
}

function getRootListNode(region: Region, node: Node): ListElement {
    let list = findClosestElementAncestor(node, region.rootNode, ListSelector) as ListElement;

    if (list) {
        let ancestor: ListElement;
        while (
            (ancestor = findClosestElementAncestor(
                list.parentNode,
                region.rootNode,
                ListSelector
            ) as ListElement)
        ) {
            list = ancestor;
        }
    }

    return list;
}

function createVListFromItemNode(node: Node): VList {
    // Create a temporary OL root element for this list.
    const listNode = node.ownerDocument.createElement('ol'); // Either OL or UL is ok here
    node.parentNode?.insertBefore(listNode, node);

    // Create the VList and append items
    const vList = new VList(listNode);
    vList.appendItem(node, ListType.None);

    return vList;
}
