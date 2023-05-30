import ContentTraverser from '../contentTraverser/ContentTraverser';
import createElement from '../utils/createElement';
import getBlockElementAtNode from '../blockElements/getBlockElementAtNode';
import getSelectionRangeInRegion from './getSelectionRangeInRegion';
import shouldSkipNode from '../utils/shouldSkipNode';
import { BlockElement, KnownCreateElementDataIndex, RegionBase } from 'roosterjs-editor-types';

/**
 * Get all block elements covered by the selection under this region
 * @param regionBase The region to get block elements from
 * @param createBlockIfEmpty When set to true, a new empty block element will be created if there is not
 * any blocks in the region. Default value is false
 * @param deprecated Deprecated parameter, not used
 */
export default function getSelectedBlockElementsInRegion(
    regionBase: RegionBase,
    createBlockIfEmpty?: boolean,
    deprecated?: boolean
): BlockElement[] {
    const range = getSelectionRangeInRegion(regionBase);
    let blocks: BlockElement[] = [];

    if (range) {
        const { rootNode, skipTags } = regionBase;
        const traverser = ContentTraverser.createSelectionTraverser(rootNode, range, skipTags);

        for (
            let block = traverser?.currentBlockElement;
            !!block;
            block = traverser.getNextBlockElement()
        ) {
            blocks.push(block);
        }

        // Remove meaningless nodes
        blocks = blocks.filter(block => {
            const startNode = block.getStartNode();
            const endNode = block.getEndNode();

            if (startNode == endNode && shouldSkipNode(startNode, true /*ignoreSpace*/)) {
                startNode.parentNode?.removeChild(startNode);
                return false;
            } else {
                return true;
            }
        });
    }

    if (blocks.length == 0 && regionBase && !regionBase.rootNode.firstChild && createBlockIfEmpty) {
        const newNode = createElement(
            KnownCreateElementDataIndex.EmptyLine,
            regionBase.rootNode.ownerDocument
        );
        regionBase.rootNode.appendChild(newNode!);

        const block = getBlockElementAtNode(regionBase.rootNode, newNode);

        if (block) {
            blocks.push(block);
        }
    }

    return blocks;
}
