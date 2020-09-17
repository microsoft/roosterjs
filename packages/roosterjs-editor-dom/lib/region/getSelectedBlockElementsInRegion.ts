import ContentTraverser from '../contentTraverser/ContentTraverser';
import fromHtml from '../utils/fromHtml';
import getBlockElementAtNode from '../blockElements/getBlockElementAtNode';
import getSelectionRangeInRegion from './getSelectionRangeInRegion';
import shouldSkipNode from '../utils/shouldSkipNode';
import { BlockElement, Region } from 'roosterjs-editor-types';

/**
 * Get all block elements covered by the selection under this region
 * @param region The region to get block elements from
 * @param createBlockIfEmpty When set to true, a new empty block element will be created if there is not
 * any blocks in the region. Default value is false
 */
export default function getSelectedBlockElementsInRegion(
    region: Region,
    createBlockIfEmpty?: boolean
): BlockElement[] {
    const range = getSelectionRangeInRegion(region);
    let blocks: BlockElement[] = [];

    if (range) {
        const { rootNode, skipTags } = region;
        const traverser = ContentTraverser.createSelectionTraverser(rootNode, range, skipTags);

        for (
            let block = traverser?.currentBlockElement;
            !!block;
            block = traverser.getNextBlockElement()
        ) {
            blocks.push(block);
        }

        // Remove unmeaningful nodes
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

    if (blocks.length == 0 && region && !region.rootNode.firstChild && createBlockIfEmpty) {
        const newNode = fromHtml('<div><br></div>', region.rootNode.ownerDocument)[0];
        region.rootNode.appendChild(newNode);
        blocks.push(getBlockElementAtNode(region.rootNode, newNode));
    }

    return blocks;
}
