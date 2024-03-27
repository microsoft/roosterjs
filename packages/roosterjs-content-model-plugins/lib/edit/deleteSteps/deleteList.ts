import { getClosestAncestorBlockGroupIndex } from 'roosterjs-content-model-dom';
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
            item &&
            index >= 0 &&
            paragraph.segments[0] == marker &&
            item.blockGroupType == 'ListItem'
        ) {
            item.levels = [];
            context.deleteResult = 'range';
        }
    }
};
