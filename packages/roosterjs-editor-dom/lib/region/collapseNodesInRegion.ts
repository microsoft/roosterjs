import collapseNode from '../utils/collapseNodes';
import isNodeInRegion from './isNodeInRegion';
import safeInstanceOf from '../utils/safeInstanceOf';
import type { BlockElement, RegionBase } from 'roosterjs-editor-types';

/**
 * Collapse nodes within this region to their common ancestor node under this region
 * @param region The region to collapse nodes in.
 * @param nodesOrBlockElements Nodes or block elements to collapse. When take BlockElement[] as input,
 * start node of the first BlockElement and end node of the last BlockElement will be used as the nodes.
 * All nodes not contained by the given region will be ignored.
 */
export default function collapseNodesInRegion(
    region: RegionBase,
    nodesOrBlockElements: Node[] | BlockElement[]
): Node[] {
    if (!nodesOrBlockElements || nodesOrBlockElements.length == 0) {
        return [];
    }

    let nodes = safeInstanceOf(nodesOrBlockElements[0], 'Node')
        ? <Node[]>nodesOrBlockElements
        : [
              nodesOrBlockElements[0].getStartNode(),
              (<BlockElement>nodesOrBlockElements[nodesOrBlockElements.length - 1]).getEndNode(),
          ];

    nodes = nodes && nodes.filter(node => isNodeInRegion(region, node));

    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];

    if (isNodeInRegion(region, firstNode) && isNodeInRegion(region, lastNode)) {
        return collapseNode(region.rootNode, firstNode, lastNode, true /*canSplitParent*/);
    } else {
        return [];
    }
}
