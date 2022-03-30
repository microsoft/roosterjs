import changeElementTag from '../utils/changeElementTag';
import contains from '../utils/contains';
import getBlockElementAtNode from '../blockElements/getBlockElementAtNode';
import getPredefinedCssForElement from '../htmlSanitizer/getPredefinedCssForElement';
import getStyles from '../style/getStyles';
import isNodeInRegion from './isNodeInRegion';
import safeInstanceOf from '../utils/safeInstanceOf';
import setStyles from '../style/setStyles';
import { BlockElement, RegionBase } from 'roosterjs-editor-types';
import { collapse } from '../utils/collapseNodes';

/**
 * Merge a BlockElement of given node after another node
 * @param region Region to operate in
 * @param refNode The node to merge after
 * @param targetNode The node of target block element
 */
export default function mergeBlocksInRegion(region: RegionBase, refNode: Node, targetNode: Node) {
    let block: BlockElement | null;

    if (
        !isNodeInRegion(region, refNode) ||
        !isNodeInRegion(region, targetNode) ||
        !(block = getBlockElementAtNode(region.rootNode, targetNode)) ||
        block.contains(refNode)
    ) {
        return;
    }

    const blockRoot = block.collapseToSingleElement();
    const commonContainer = collapse(
        region.rootNode,
        blockRoot,
        refNode,
        false /*isStart*/,
        true /*canSplitParent*/
    );

    // Copy styles of parent nodes into blockRoot
    for (let node: Node | null = blockRoot; contains(commonContainer, node); ) {
        const parent: Node | null = node!.parentNode;
        if (safeInstanceOf(parent, 'HTMLElement')) {
            const styles = {
                ...(getPredefinedCssForElement(parent) || {}),
                ...getStyles(parent),
                ...getStyles(blockRoot),
            };
            setStyles(blockRoot, styles);
        }
        node = parent;
    }

    let nodeToRemove: Node | null = null;
    let nodeToMerge =
        blockRoot.childNodes.length == 1 && blockRoot.attributes.length == 0
            ? blockRoot.firstChild!
            : changeElementTag(blockRoot, 'SPAN')!;

    // Remove empty node
    for (
        let node: Node | null = nodeToMerge;
        contains(commonContainer, node) && node.parentNode?.childNodes.length == 1;
        node = node!.parentNode
    ) {
        // If the only child is the one which is about to be removed, this node should also be removed
        nodeToRemove = node.parentNode;
    }

    // Finally, merge blocks, and remove empty nodes
    refNode.parentNode?.insertBefore(nodeToMerge, refNode.nextSibling);
    nodeToRemove?.parentNode?.removeChild(nodeToRemove);
}
