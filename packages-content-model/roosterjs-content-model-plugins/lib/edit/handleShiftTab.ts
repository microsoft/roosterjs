import { getClosestAncestorBlockGroupIndex } from 'roosterjs-content-model-core';
import type { DeleteSelectionStep } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleShiftTab: DeleteSelectionStep = context => {
    if (context.deleteResult == 'nothingToDelete' || context.deleteResult == 'notDeleted') {
        const { insertPoint } = context;
        const { path } = insertPoint;
        const index = getClosestAncestorBlockGroupIndex(
            path,
            ['FormatContainer', 'ListItem'],
            ['TableCell']
        );

        const listItem = path[index];
        if (listItem.blockGroupType === 'ListItem') {
        }
    }
};
