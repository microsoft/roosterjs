import { getClosestAncestorBlockGroupIndex } from 'roosterjs-content-model-core';
import type { DeleteSelectionStep } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const deleteList: DeleteSelectionStep = context => {
    const { paragraph, marker, path } = context.insertPoint;

    if (context.deleteResult == 'nothingToDelete' || context.deleteResult == 'notDeleted') {
        const index = getClosestAncestorBlockGroupIndex(path, ['ListItem', 'TableCell']);
        const item = path[index];
        if (
            index >= 0 &&
            paragraph.segments[0] == marker &&
            item.blockGroupType == 'ListItem' &&
            (paragraph.segments.length == 1 ||
                (paragraph.segments.length == 2 && paragraph.segments[1].segmentType == 'Br'))
        ) {
            item.levels = [];
            context.deleteResult = 'range';
        }
    }
};
