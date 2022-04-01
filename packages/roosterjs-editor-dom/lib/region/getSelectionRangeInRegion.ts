import createRange from '../selection/createRange';
import Position from '../selection/Position';
import { getNextLeafSibling, getPreviousLeafSibling } from '../utils/getLeafSibling';
import { Region, RegionBase } from 'roosterjs-editor-types';

/**
 * Get the selection range in the given region.
 * The original range can cover multiple regions, this function will narrow the original selection
 * of a region into current region
 * @param regionBase The region to get range from
 */
export default function getSelectionRangeInRegion(regionBase: RegionBase): Range | null {
    if (!regionBase) {
        return null;
    }

    const { nodeBefore, nodeAfter, rootNode, skipTags } = regionBase;
    const startNode = nodeBefore
        ? getNextLeafSibling(regionBase.rootNode, nodeBefore, regionBase.skipTags)
        : rootNode.firstChild;
    const endNode = nodeAfter
        ? getPreviousLeafSibling(rootNode, nodeAfter, skipTags)
        : rootNode.lastChild;
    const regionRange = startNode && endNode && createRange(startNode, endNode);

    if (!isRegion(regionBase)) {
        return regionRange;
    } else if (regionRange) {
        const regionStart = Position.getStart(regionRange).normalize();
        const regionEnd = Position.getEnd(regionRange).normalize();
        const { fullSelectionEnd, fullSelectionStart } = regionBase;

        if (!fullSelectionStart.isAfter(regionEnd) && !regionStart.isAfter(fullSelectionEnd)) {
            const start = fullSelectionStart.isAfter(regionStart)
                ? fullSelectionStart
                : regionStart;
            const end = fullSelectionEnd.isAfter(regionEnd) ? regionEnd : fullSelectionEnd;

            return createRange(start, end);
        }
    }

    return null;
}

function isRegion(regionBase: RegionBase): regionBase is Region {
    const region = regionBase as Region;
    return !!region.fullSelectionEnd && !!region.fullSelectionStart;
}
