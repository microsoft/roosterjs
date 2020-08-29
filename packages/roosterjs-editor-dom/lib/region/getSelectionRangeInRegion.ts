import createRange from '../selection/createRange';
import Position from '../selection/Position';
import { getNextLeafSibling, getPreviousLeafSibling } from '../utils/getLeafSibling';
import { Region } from 'roosterjs-editor-types';

/**
 * Get the selection range in the given region.
 * The original range can cover multiple regions, this function will narrow the origianl selection
 * of a region into current region
 * @param region The region to get range from
 */
export default function getSelectionRangeInRegion(region: Region): Range | null {
    let result: Range = null;

    if (region) {
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

        if (startNode && endNode) {
            const regionRange = createRange(startNode, endNode);
            const regionStart = Position.getStart(regionRange).normalize();
            const regionEnd = Position.getEnd(regionRange).normalize();

            if (!fullSelectionStart.isAfter(regionEnd) && !regionStart.isAfter(fullSelectionEnd)) {
                const start = fullSelectionStart.isAfter(regionStart)
                    ? fullSelectionStart
                    : regionStart;
                const end = fullSelectionEnd.isAfter(regionEnd) ? regionEnd : fullSelectionEnd;

                result = createRange(start, end);
            }
        }
    }

    return result;
}
