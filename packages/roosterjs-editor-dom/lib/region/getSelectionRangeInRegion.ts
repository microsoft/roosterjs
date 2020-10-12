import createRange from '../selection/createRange';
import Position from '../selection/Position';
import { getNextLeafSibling, getPreviousLeafSibling } from '../utils/getLeafSibling';
import { Region } from 'roosterjs-editor-types';

/**
 * Get the selection range in the given region.
 * The original range can cover multiple regions, this function will narrow the origianl selection
 * of a region into current region
 * @param region The region to get range from
 * @param ignoreFullSelectionInRegion (Optional) True to ignore the fullSelectionStart/end value in region, and
 * return a range for the whole region, false to only return the selected part of region
 */
export default function getSelectionRangeInRegion(
    region: Region,
    ignoreFullSelectionInRegion?: boolean
): Range | null {
    if (!region) {
        return null;
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
    const regionRange = startNode && endNode && createRange(startNode, endNode);

    if (ignoreFullSelectionInRegion) {
        return regionRange;
    } else if (regionRange) {
        const regionStart = Position.getStart(regionRange).normalize();
        const regionEnd = Position.getEnd(regionRange).normalize();

        if (!fullSelectionStart.isAfter(regionEnd) && !regionStart.isAfter(fullSelectionEnd)) {
            const start = fullSelectionStart.isAfter(regionStart)
                ? fullSelectionStart
                : regionStart;
            const end = fullSelectionEnd.isAfter(regionEnd) ? regionEnd : fullSelectionEnd;

            return createRange(start, end);
        } else {
            return null;
        }
    }
}
