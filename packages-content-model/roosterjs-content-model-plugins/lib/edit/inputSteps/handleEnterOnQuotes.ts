import { getClosestAncestorBlockGroupIndex } from 'roosterjs-content-model-core';
import {} from 'roosterjs-content-model-dom';
import type { DeleteSelectionStep } from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleEnterOnList: DeleteSelectionStep = context => {
    const { deleteResult } = context;
    if (
        deleteResult == 'nothingToDelete' ||
        deleteResult == 'notDeleted' ||
        deleteResult == 'range'
    ) {
        const { insertPoint, formatContext } = context;
        const { path } = insertPoint;
        const rawEvent = formatContext?.rawEvent;
        const index = getClosestAncestorBlockGroupIndex(
            path,
            ['FormatContainer'],
            ['TableCell', 'ListItem']
        );
        const quote = path[index];
        if (quote.blockGroupType === 'FormatContainer' && quote.tagName == 'blockquote') {
            rawEvent?.preventDefault();
        }
    }
};
