import ContentTraverser from '../contentTraverser/ContentTraverser';
import createRange from '../selection/createRange';
import Position from '../selection/Position';
import { BlockElement, PositionType, Region } from 'roosterjs-editor-types';
import { getNextLeafSibling, getPreviousLeafSibling } from '../utils/getLeafSibling';

/**
 * Get all block elements covered by the selection under this region
 */
export default function getSelectedBlockElementsInRegion(region: Region): BlockElement[] {
    if (!region) {
        return [];
    }

    const {
        nodeBefore,
        nodeAfter,
        rootNode,
        skipTags,
        fullSelectionEnd,
        fullSelectionStart,
    } = region;
    const startNode = nodeBefore
        ? getNextLeafSibling(region.rootNode, nodeBefore, region.skipTags)
        : rootNode.firstChild;
    const endNode = nodeAfter
        ? getPreviousLeafSibling(rootNode, nodeAfter, skipTags)
        : rootNode.lastChild;
    const regionStart = new Position(startNode, PositionType.Begin).normalize();
    const regionEnd = new Position(endNode, PositionType.End).normalize();
    const start = fullSelectionStart.isAfter(regionStart) ? fullSelectionStart : regionStart;
    const end = fullSelectionEnd.isAfter(regionEnd) ? regionEnd : fullSelectionEnd;
    const blocks: BlockElement[] = [];

    if (startNode && endNode) {
        const range = createRange(start, end);
        const traverser = ContentTraverser.createSelectionTraverser(rootNode, range, skipTags);

        for (
            let block = traverser?.currentBlockElement;
            !!block;
            block = traverser.getNextBlockElement()
        ) {
            blocks.push(block);
        }
    }

    return blocks;
}
