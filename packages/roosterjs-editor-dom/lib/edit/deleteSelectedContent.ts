import arrayPush from '../jsUtils/arrayPush';
import collapseNodesInRegion from '../region/collapseNodesInRegion';
import getRegionsFromRange from '../region/getRegionsFromRange';
import getSelectionRangeInRegion from '../region/getSelectionRangeInRegion';
import mergeBlocksInRegion from '../region/mergeBlocksInRegion';
import Position from '../selection/Position';
import queryElements from '../utils/queryElements';
import safeInstanceOf from '../utils/safeInstanceOf';
import splitTextNode from '../utils/splitTextNode';
import { NodePosition, PositionType, QueryScope, RegionType } from 'roosterjs-editor-types';

/**
 * Delete selected content, and return the new position to select
 * @param core The EditorCore object.
 * @param range The range to delete
 */
export default function deleteSelectedContent(
    root: HTMLElement,
    range: Range
): NodePosition | null {
    let nodeBefore: Node | null = null;

    // 1. TABLE and TR node in selected should be deleted. It is possible we don't detect them from step 2
    // since table cells will fall in to different regions
    const nodesToDelete: Node[] = queryElements(
        root,
        'table,tr',
        null /*callback*/,
        QueryScope.InSelection,
        range
    );

    // 2. Loop all selected regions, find out those nodes need to be deleted and merged.
    // We don't delete them directly here because delete node from one region may cause selection range
    // another region becomes invalid. So we delay the process of deletion.
    const regions = getRegionsFromRange(root, range, RegionType.Table);
    const nodesPairToMerge = regions
        .map(region => {
            const regionRange = getSelectionRangeInRegion(region);
            if (!regionRange) {
                return null;
            }

            const {
                startContainer,
                endContainer,
                startOffset,
                endOffset,
                commonAncestorContainer,
            } = regionRange;

            // Disallow merging of readonly elements
            if (
                safeInstanceOf(commonAncestorContainer, 'HTMLElement') &&
                !commonAncestorContainer.isContentEditable
            ) {
                return null;
            }

            // Make sure there are node before and after the merging point.
            // This is required by mergeBlocksInRegion API.
            // This may create some empty text node as anchor
            let [beforeEnd, afterEnd] = ensureBeforeAndAfter(
                endContainer,
                endOffset,
                false /*isStart*/
            );
            let [beforeStart, afterStart] = ensureBeforeAndAfter(
                startContainer,
                startOffset,
                true /*isStart*/
            );
            nodeBefore = nodeBefore || beforeStart;

            // Find out all nodes to be deleted
            const nodes = collapseNodesInRegion(region, [afterStart, beforeEnd]);
            arrayPush(nodesToDelete, nodes);
            return { region, beforeStart, afterEnd };
        })
        .filter(x => !!x);

    // 3. Delete all nodes that we found, whose parent is editable
    nodesToDelete.forEach(
        node => node.parentElement?.isContentEditable && node.parentElement.removeChild(node)
    );

    // 4. Merge lines for each region, so that after we don't see extra line breaks
    nodesPairToMerge.forEach(nodes => {
        if (nodes) {
            mergeBlocksInRegion(nodes.region, nodes.beforeStart, nodes.afterEnd);
        }
    });

    return nodeBefore && new Position(nodeBefore, PositionType.End);
}

function ensureBeforeAndAfter(node: Node, offset: number, isStart: boolean) {
    if (safeInstanceOf(node, 'Text')) {
        const newNode = splitTextNode(node, offset, isStart);
        return isStart ? [newNode, node] : [node, newNode];
    } else {
        let nodeBefore: Node | null = node.childNodes[offset - 1];
        let nodeAfter: Node | null = node.childNodes[offset];

        // Condition 1: node child nodes
        // ("I" means cursor; "o" means a DOM node, "[ ]" means a parent node)
        // [ I ]
        // need to use parent node instead to convert to condition 2
        if (!nodeBefore && !nodeAfter) {
            if (isStart) {
                nodeAfter = node;
                nodeBefore = nodeAfter.previousSibling;
            } else {
                nodeBefore = node;
                nodeAfter = nodeBefore.nextSibling;
            }
        }

        // Condition 2: Either nodeBefore or nodeAfter is null (XOR case)
        // [ o I ]  or [ I o]
        // need to add empty text node to convert to condition 3
        if ((nodeBefore || nodeAfter) && (!nodeBefore || !nodeAfter)) {
            const emptyNode = node.ownerDocument!.createTextNode('');
            (nodeBefore || nodeAfter)?.parentNode?.insertBefore(emptyNode, nodeAfter);
            if (nodeBefore) {
                nodeAfter = emptyNode;
            } else {
                nodeBefore = emptyNode;
            }
        }

        // Condition 3: Both nodeBefore and nodeAfter are not null
        // [o I o]
        // return the nodes
        return [nodeBefore!, nodeAfter!];
    }
}
