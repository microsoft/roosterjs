import contains from '../utils/contains';
import { DocumentPosition, Region } from 'roosterjs-editor-types';

/**
 * Check if a given node is contained by the given region
 * @param region The region to check from
 * @param node The node or block element to check
 */
export default function isNodeInRegion(region: Region, node: Node): boolean {
    return !!(
        region &&
        contains(region.rootNode, node) &&
        (!region.nodeBefore ||
            region.nodeBefore.compareDocumentPosition(node) == DocumentPosition.Following) &&
        (!region.nodeAfter ||
            region.nodeAfter.compareDocumentPosition(node) == DocumentPosition.Preceding)
    );
}
