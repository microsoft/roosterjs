import collapseNode from '../utils/collapseNodes';
import isNodeInRegion from './isNodeInRegion';
import { Region } from 'roosterjs-editor-types';

/**
 * Collapse nodes within this region to their common ascenstor node under this region
 * @param region The region to collapse nodes in.
 * @param nodes Nodes to collapse. All nodes not contained by the given region will be ignored.
 */
export default function collapseNodesInRegion(region: Region, nodes: Node[]): Node[] {
    nodes = nodes && nodes.filter(node => isNodeInRegion(region, node));

    if (!nodes || nodes.length == 0) {
        return [];
    }

    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];

    if (isNodeInRegion(region, firstNode) && isNodeInRegion(region, lastNode)) {
        return collapseNode(region.rootNode, firstNode, lastNode, true /*canSplitParent*/);
    } else {
        return [];
    }
}
